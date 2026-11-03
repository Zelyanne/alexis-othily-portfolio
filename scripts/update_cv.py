"""Update the current role and education titles in the original CV."""

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
    missing = set(text) - glyphs.keys()
    assert not missing, f"The original font lacks {sorted(missing)} for {text!r}"
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
        operands[5] = FloatObject(float(operands[5]) + 280)
        shifted += 1
assert shifted == 12, "Unexpected original experience layout"
form.set_data(content.get_data())

fonts = form["/Resources"]["/Font"]
page_two = writer.pages[1]
page_two_form = page_two["/Resources"]["/XObject"]["/X15"].get_object()
page_two_fonts = page_two_form["/Resources"]["/Font"]
page["/Resources"][NameObject("/Font")] = DictionaryObject({
    NameObject("/RoleBold"): fonts.raw_get("/F8"),
    NameObject("/RoleItalic"): fonts.raw_get("/F6"),
    NameObject("/RoleRegular"): page_two_fonts.raw_get("/F5"),
})
role_fonts = {"/F8": fonts["/F8"], "/F6": fonts["/F6"], "/F5": page_two_fonts["/F5"]}
lines = [
    ("/RoleBold", "/F8", 10.0, 152.238, 523.544, "Développeur IA Freelance - Harnix | Calavi"),
    ("/RoleItalic", "/F6", 8.0, 152.180, 509.200, "Contrat de prestation - Poste actuel"),
    ("/RoleRegular", "/F5", 8.0, 165.840, 493.400,
     "Architecture du harness agentique de Nixia : sélection des modèles et orchestration d'agents spécialisés."),
    ("/RoleRegular", "/F5", 8.0, 165.840, 479.000,
     "Optimisation de l'inférence, triplant ainsi la vitesse d'exécution des requêtes."),
]
addition = """q
0 g
156.95 495.90 m 156.95 496.59 156.39 497.15 155.70 497.15 c
155.01 497.15 154.45 496.59 154.45 495.90 c
154.45 495.21 155.01 494.65 155.70 494.65 c
156.39 494.65 156.95 495.21 156.95 495.90 c f
156.95 481.50 m 156.95 482.19 156.39 482.75 155.70 482.75 c
155.01 482.75 154.45 482.19 154.45 481.50 c
154.45 480.81 155.01 480.25 155.70 480.25 c
156.39 480.25 156.95 480.81 156.95 481.50 c f
"""
for name, font, size, x, y, text in lines:
    addition += f"BT {name} {size} Tf 1 0 0 1 {x} {y} Tm <{encode_text(role_fonts[font], text)}> Tj ET\n"
addition += "Q\n"
stream = DecodedStreamObject()
stream.set_data(b"q\n" + page.get_contents().get_data() + b"\nQ\n" + addition.encode("ascii"))
page[NameObject("/Contents")] = writer._add_object(stream)

page_two_content = ContentStream(page_two_form, writer)
block = -1
character = -1
skip_advance = False
removed = 0
kept_operations = []

# shortcut: these character positions are stable in the supplied Canva PDF.
for operands, operator in page_two_content.operations:
    if operator == b"BT":
        block += 1
        character = -1
    if block in (3, 6) and operator == b"Tj":
        character += 1
        if character in (8, 9):
            removed += 1
            skip_advance = True
            continue
    if block in (3, 6) and operator == b"Td" and skip_advance:
        skip_advance = False
        continue
    kept_operations.append((operands, operator))
assert removed == 4, "Unexpected original education layout"
page_two_content.operations = kept_operations
page_two_form.set_data(page_two_content.get_data())

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
writer.write(OUTPUT)

updated = PdfReader(OUTPUT)
assert len(updated.pages) == len(original.pages) == 2
for page_number, (before, after) in enumerate(zip(original.pages, updated.pages)):
    assert before.mediabox == after.mediabox
    assert links(before) == links(after), "An original certificate or profile link changed"
    old_text = re.sub(r"\s+", "", before.extract_text())
    new_text = re.sub(r"\s+", "", after.extract_text())
    if page_number == 1:
        old_text = old_text.replace("Licence2ComputerScience", "LicenceComputerScience")
        old_text = old_text.replace("Licence2MathematiqueInformatique", "LicenceMathematiqueInformatique")
    assert old_text in new_text, "Original CV content was lost"
page_one_text = updated.pages[0].extract_text()
for phrase in ("Harnix", "Freelance", "Calavi", "Contrat de prestation", "Nixia", "harness", "inférence", "triplant"):
    assert phrase in page_one_text
page_two_text = updated.pages[1].extract_text()
page_two_text_compact = re.sub(r"\s+", "", page_two_text)
assert "Licence2" not in page_two_text_compact
assert "LicenceMathematiqueInformatique" in page_two_text_compact
assert "LicenceComputerScience" in page_two_text_compact
assert "ANNEXE" not in page_two_text
assert "Nixia-AIworkspace" not in page_two_text_compact
print(f"Updated {OUTPUT}: two pages, original content and links preserved.")
