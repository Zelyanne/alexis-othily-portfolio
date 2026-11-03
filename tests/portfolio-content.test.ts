import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'
import { credentials, experiences, huggingFaceHref, projects, services } from '../src/portfolio-data.ts'

test('the redesign preserves all published prices and timelines', () => {
  assert.deepEqual(
    services.map(({ id, westAfrica, world, timeline }) => [id, westAfrica, world, timeline]),
    [
      ['chatbot-app', { fr: '200K FCFA', en: '200K FCFA' }, { fr: '600 EUR', en: '600 EUR' }, { fr: '2 semaines - 1 mois', en: '2 weeks - 1 month' }],
      ['voice-agent', { fr: 'à partir de 650K FCFA', en: 'from 650K FCFA' }, { fr: 'à partir de 2000 EUR', en: 'from 2000 EUR' }, { fr: '1 - 4 mois', en: '1 - 4 months' }],
      ['workflow-agent', { fr: 'à partir de 450K FCFA', en: 'from 450K FCFA' }, { fr: 'à partir de 1300 EUR', en: 'from 1300 EUR' }, { fr: '1 - 3 mois', en: '1 - 3 months' }],
      ['coding-agent', { fr: 'à partir de 300K FCFA', en: 'from 300K FCFA' }, { fr: 'à partir de 1000 EUR', en: 'from 1000 EUR' }, { fr: '1 - 3 mois', en: '1 - 3 months' }],
      ['vision-signal', { fr: 'à partir de 400K FCFA', en: 'from 400K FCFA' }, { fr: 'à partir de 1200 EUR', en: 'from 1200 EUR' }, { fr: '1 - 3 mois', en: '1 - 3 months' }],
    ],
  )
})

test('real project destinations, translated content and preview assets are retained', async () => {
  assert.deepEqual(projects.map(({ href }) => href), [
    'https://aizelyan.duckdns.org/',
    'https://lin-ai.duckdns.org/',
    'https://vps-55e5f624.vps.ovh.net/',
    null,
    'https://www.nixia.app/',
  ])
  for (const project of projects) {
    for (const language of ['fr', 'en'] as const) {
      assert.ok(project[language].title)
      assert.ok(project[language].summary)
      assert.ok(project[language].role)
      if (project.preview) assert.ok(project.preview[language])
    }
    if (project.preview) await access(new URL(`../public${project.preview.src}`, import.meta.url))
  }
})

test('new project teasers and professional credentials stay verifiable', () => {
  assert.deepEqual(projects.slice(-2).map(({ slug, preview }) => [slug, preview]), [
    ['cahier-du-soir', null], ['nixia', null],
  ])
  assert.equal(experiences[0].frTitle, 'Développeur IA Freelance - Harnix | Calavi')
  assert.equal(experiences[0].enTitle, 'Freelance AI Developer - Harnix | Calavi')
  assert.equal(experiences[0].frDate, 'Contrat de prestation - Aujourd’hui')
  assert.equal(experiences[0].enDate, 'Independent contract - Current')
  assert.match(experiences[0].fr, /triplant ainsi la vitesse/)
  assert.match(experiences[0].en, /tripled request execution speed/)
  assert.equal(huggingFaceHref, 'https://huggingface.co/Zelyanoth')
  assert.equal(credentials[0][2], huggingFaceHref)
  assert.deepEqual(credentials.slice(1).map(([, , href]) => href), [
    'https://zindi.africa/zc/xoHPRGQ', 'https://zindi.africa/zc/2XHGm9W',
  ])
})

test('the updated CV is a published PDF', async () => {
  const pdf = await readFile(new URL('../public/Alexis-OTHILY-CV.pdf', import.meta.url))
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
})
