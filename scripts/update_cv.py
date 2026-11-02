"""Add the confirmed current role while preserving the original PDF and fonts."""

from pathlib import Path
import re

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, DecodedStreamObject, DictionaryObject, FloatObject, NameObject

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "mqjoscgf-Alexis-OTHILY-CV.pdf"
OUTPUT = ROOT / "public/Alexis-OTHILY-CV.pdf"


def encode_text(font, text):
    cmap = font["/ToUnicode"].get_object().get_data().decode("ascii")
    glyphs = {}
    for block in re.findall(r"beginbfchar(.*?)endbfchar", cmap, re.S):
        for glyph, value in re.findall(r"<([0-9A-F]+)>\s*<([0-9A-F]+)>", block):
            glyphs[bytes.fromhex(value).decode("utf-16-be")] = int(glyph, 16)
    for block in re.findall(r"beginbfrange(.*?)endbfrange", cmap, re.S):
        for first, last, value in re.findall(r"<([0-9A-F]+)>\s*<([0-9A-F]+)>\s*<([0-9A-F]+)>", block):
            for offset, glyph in enumerate(range(int(first, 16), int(last, 16) + 1)):
                glyphs[chr(int(value, 16) + offset)] = glyph
    assert set(text) <= glyphs.keys(), "The original font lacks a required character"
    return "".join(f"{glyphs[character]:04X}" for character in text)


def links(page):
    return [
        (list(annotation.get_object()["/Rect"]), annotation.get_object()["/A"]["/URI"])
        for annotation in page.get("/Annots", [])
    ]


original = PdfReader(SOURCE)
writer = PdfWriter(clone_from=SOURCE)
page = writer.pages[0]
form = page["/Resources"]["/XObject"]["/X21"].get_object()
content = ContentStream(form, writer)
shifted = 0

# shortcut: coordinates target this supplied CV; recheck them if its source changes.
for operands, operator in content.operations:
    if operator == b"cm" and 630 <= float(operands[4]) <= 650 and float(operands[5]) > 1300:
        operands[5] = FloatObject(float(operands[5]) + 200)
        shifted += 1
assert shifted == 12, "Unexpected original experience layout"
form.set_data(content.get_data())

fonts = form["/Resources"]["/Font"]
page["/Resources"][NameObject("/Font")] = DictionaryObject({
    NameObject("/RoleBold"): fonts.raw_get("/F8"),
    NameObject("/RoleItalic"): fonts.raw_get("/F6"),
    NameObject("/RoleRegular"): fonts.raw_get("/F4"),
})
lines = [
    ("/RoleBold", "/F8", 10.0, 152.238, 523.544, "Développeur IA - Harnix"),
    ("/RoleItalic", "/F6", 8.0, 152.180, 509.200, "Poste actuel"),
    ("/RoleRegular", "/F4", 8.0, 152.180, 493.400,
     "Développement de solutions logicielles et d'intelligence artificielle."),
]
addition = "q\n0 g\n"
for name, font, size, x, y, text in lines:
    addition += f"BT {name} {size} Tf 1 0 0 1 {x} {y} Tm <{encode_text(fonts[font], text)}> Tj ET\n"
addition += "Q\n"
stream = DecodedStreamObject()
stream.set_data(b"q\n" + page.get_contents().get_data() + b"\nQ\n" + addition.encode("ascii"))
page[NameObject("/Contents")] = writer._add_object(stream)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
writer.write(OUTPUT)

updated = PdfReader(OUTPUT)
assert len(updated.pages) == len(original.pages) == 2
for before, after in zip(original.pages, updated.pages):
    assert before.mediabox == after.mediabox
    assert links(before) == links(after), "An original certificate or profile link changed"
    old_text = re.sub(r"\s+", "", before.extract_text())
    new_text = re.sub(r"\s+", "", after.extract_text())
    assert old_text in new_text, "Original CV content was lost"
assert "Harnix" in updated.pages[0].extract_text()
assert original.pages[1].get_contents().get_data() == updated.pages[1].get_contents().get_data()
print(f"Updated {OUTPUT}: two pages, original content and links preserved.")
