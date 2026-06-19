import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import './styles.css'
import portraitUrl from '../portrait-cutout.png'

const cvUrl = new URL('../mqjoscgf-Alexis-OTHILY-CV.pdf', import.meta.url).href
const email = 'othilyjose14@gmail.com'
const configuredAnalyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined
const analyticsEndpoint = configuredAnalyticsEndpoint || '/api/analytics'
const analyticsStorageKey = 'alexis-portfolio-clicks'

type AnalyticsEvent = {
  href: string
  id: string
  label: string
  locale: string
  path: string
  timeZone: string
  timestamp: string
}

type AnalyticsStats = {
  total: number
  locations: Array<{ label: string; count: number }>
  recent: AnalyticsEvent[]
}

const projects = [
  {
    slug: 'ai-assistant',
    label: 'Assistant IA',
    title: 'AI Assistant - Executive Hub',
    href: 'https://aizelyan.duckdns.org/',
    summary:
      "Agent IA orienté Google Workspace pour orchestrer des tâches bureautiques, connecter des outils et planifier des actions différées.",
    result: 'Orchestration Google Workspace',
    role: 'Architecture agentique',
    stack: ['LangGraph', 'TypeScript', 'Mistral', 'MCP'],
    tone: 'teal',
  },
  {
    slug: 'lin-automation',
    label: 'Automatisation',
    title: 'Lin - Community Manager IA',
    href: 'https://lin-ai.duckdns.org/',
    summary:
      'Pipeline agentique qui transforme des mots-clés en posts LinkedIn structurés, planifiés et prêts à publier.',
    result: 'Génération + planification',
    role: 'Pipeline IA',
    stack: ['LangGraph', 'Python', 'Mistral'],
    tone: 'rose',
  },
  {
    slug: 'e-learning',
    label: 'EdTech',
    title: 'Plateforme e-learning',
    href: 'https://vps-55e5f624.vps.ovh.net/',
    summary:
      'Backend Python/Flask avec gestion utilisateurs, contenus pédagogiques, progression, quiz et évaluations automatiques.',
    result: 'API e-learning complète',
    role: 'Backend produit',
    stack: ['Python', 'Flask', 'SQL'],
    tone: 'amber',
  },
] as const

const domains = [
  {
    title: 'AI Engineering',
    text: 'Agents IA, workflows LangGraph, orchestration MCP et modèles appliqués.',
    tools: ['Python', 'TypeScript', 'LangGraph', 'LangChain', 'Mistral', 'Hugging Face'],
  },
  {
    title: 'Data Analysis',
    text: 'Analyse métier, dashboards, modèles ML et restitution de tendances.',
    tools: ['Python', 'SQL', 'Jupyter', 'Taipy', 'scikit-learn', 'PyTorch'],
  },
  {
    title: 'Back end dev',
    text: 'APIs, bases de données, auth, logique produit et déploiement applicatif.',
    tools: ['Python', 'Flask', 'FastAPI', 'Django', 'PostgreSQL', 'Docker'],
  },
] as const

const skills = [
  'Agentic workflow',
  'Computer vision',
  'Machine learning',
  'Deep learning',
  'Python',
  'FastAPI',
  'Flask',
  'Django',
  'TypeScript',
  'Java',
  'Go',
  'SQL',
  'LangGraph',
  'LangChain',
  'Hugging Face',
  'PyTorch',
  'TensorFlow',
  'Docker',
  'Supabase',
]

const experiences = [
  {
    date: 'Déc. 2025 - Avr. 2026',
    title: 'EdTech Program Manager - Neural Bridge',
    text: "Conception de contenus pédagogiques pour l'apprentissage du code et solutions IA adaptées aux apprenants adultes.",
  },
  {
    date: 'Mai 2026',
    title: 'Freelance - Backend e-learning',
    text: 'Architecture backend Python/Flask, base de données, authentification, progression et modules d’évaluation.',
  },
  {
    date: 'Juil. 2024 - Oct. 2024',
    title: 'Data Scientist stagiaire - AFG Assurances Bénin Vie',
    text: "Dashboard Taipy, analyse de 3 années de données commerciales et restitution d'insights décisionnels.",
  },
  {
    date: 'Oct. 2022 - Jan. 2023',
    title: 'Data Scientist stagiaire - Holding Bourjon Investment',
    text: 'PostgreSQL sous Docker, backend FastAPI, optimisation de flux de trésorerie et modèles YOLO en photogrammétrie.',
  },
]

const credentials = [
  ['Hugging Face', 'Certificate of Excellence - Agents IA'],
  ['Zindi', '8e / 70 - Your Voice, Your Device, Your Language'],
  ['Zindi', '47e / 245 - CGIAR Root Volume Estimation'],
] as const

function readLocalAnalyticsEvents() {
  try {
    const raw = window.localStorage.getItem(analyticsStorageKey)
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : []
  } catch {
    return []
  }
}

function getAnalyticsStats(events: AnalyticsEvent[]): AnalyticsStats {
  const locationCounts = new Map<string, number>()
  for (const event of events) {
    const label = `${event.locale || 'locale inconnue'} / ${event.timeZone || 'zone inconnue'}`
    locationCounts.set(label, (locationCounts.get(label) || 0) + 1)
  }

  return {
    total: events.length,
    locations: [...locationCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recent: [...events].reverse().slice(0, 12),
  }
}

function trackLandingClick(id: string, label: string, href: string) {
  const event: AnalyticsEvent = {
    href,
    id,
    label,
    locale: navigator.language,
    path: window.location.pathname,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  }

  const events = readLocalAnalyticsEvents()
  window.localStorage.setItem(analyticsStorageKey, JSON.stringify([...events, event]))

  const body = JSON.stringify(event)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(analyticsEndpoint, new Blob([body], { type: 'application/json' }))
    return
  }

  void fetch(analyticsEndpoint, {
    body,
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    method: 'POST',
  })
}

function Layout() {
  return (
    <>
      <header className="nav page">
        <Link className="brand" to="/">
          <span aria-hidden="true" />
          Alexis Othily
        </Link>
        <nav aria-label="Navigation principale">
          <a href="/#projects">Projets</a>
          <a href="/#skills">Compétences</a>
          <a href="/#experience">Expérience</a>
          <Link to="/cv">CV</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="footer page">
        <span>Disponible freelance - Cotonou</span>
        <a href={`mailto:${email}`}>{email}</a>
      </footer>
    </>
  )
}

function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Développeur IA - Cotonou</p>
          <h1>Agents IA, vision et backend produit.</h1>
          <p className="lead">
            Je conçois des systèmes IA concrets: agents LangGraph, pipelines de
            données, computer vision et backends Python prêts pour des
            utilisateurs réels.
          </p>
          <p className="heroNote">
            Mon terrain: AI engineering, data analysis et back-end dev pour
            transformer un besoin métier en système fiable.
          </p>
          <div className="actions">
            <a className="button primary" href="#projects">
              Voir les projets
            </a>
            <a className="button" href={`mailto:${email}`}>
              Me contacter
            </a>
            <Link className="button" to="/cv">
              CV PDF
            </Link>
          </div>
          <div className="proof" aria-label="Domaines techniques">
            {domains.map((domain) => (
              <article className="proofItem" key={domain.title}>
                <h2>{domain.title}</h2>
                <p>{domain.text}</p>
                <div>
                  {domain.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
        <figure className="portrait">
          <img src={portraitUrl} alt="Portrait professionnel d'Alexis Othily" />
          <figcaption>Disponible freelance</figcaption>
        </figure>
      </section>

      <section id="projects" className="section">
        <div className="sectionHead">
          <p className="eyebrow">Sélection de travaux</p>
          <h2>Des projets IA qui relient modèle, produit et usage.</h2>
        </div>
        <div className="projectGrid">
          {projects.map((project) => (
            <article className={`projectCard ${project.tone}`} key={project.slug}>
              <div>
                <p className="tag">{project.label}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <dl className="projectMeta">
                <div>
                  <dt>Rôle</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>Impact</dt>
                  <dd>{project.result}</dd>
                </div>
              </dl>
              <div className="stack">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <a
                href={project.href}
                onClick={() => trackLandingClick(project.slug, project.title, project.href)}
                target="_blank"
                rel="noreferrer"
              >
                Visiter le site <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="section split">
        <div>
          <p className="eyebrow">Stack</p>
          <h2>Une base IA large, avec un cœur Python produit.</h2>
          <p className="sectionText">
            Profil utile quand il faut connecter la recherche appliquée, l'API,
            les données et une interface exploitable.
          </p>
        </div>
        <div className="skillColumn">
          <div className="skillList">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          <div className="credentialList" aria-label="Certifications et résultats">
            {credentials.map(([source, label]) => (
              <article key={label}>
                <span>{source}</span>
                <strong>{label}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <div className="sectionHead">
          <p className="eyebrow">Parcours</p>
          <h2>Des expériences proches du terrain.</h2>
        </div>
        <div className="timeline">
          {experiences.map((experience) => (
            <article key={experience.title}>
              <time>{experience.date}</time>
              <h3>{experience.title}</h3>
              <p>{experience.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact">
        <div>
          <p className="eyebrow">Recruteurs & clients</p>
          <h2>Parlons d'un agent IA, d'une API ou d'un pipeline vision.</h2>
        </div>
        <div className="contactLinks">
          <a className="button primary" href={`mailto:${email}`}>
            Envoyer un email
          </a>
          <a className="button" href="tel:+2290191112696">
            +229 01 91 11 26 96
          </a>
          <a className="button" href="https://github.com/Zelyanne" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </section>
    </main>
  )
}

function CountPage() {
  const [remoteStats, setRemoteStats] = useState<AnalyticsStats | null>(null)
  const [remoteError, setRemoteError] = useState('')
  const [localEvents, setLocalEvents] = useState<AnalyticsEvent[]>([])

  useEffect(() => {
    setLocalEvents(readLocalAnalyticsEvents())

    fetch(analyticsEndpoint)
      .then((response) => {
        if (!response.ok) throw new Error('analytics unavailable')
        return response.json() as Promise<AnalyticsStats>
      })
      .then(setRemoteStats)
      .catch(() => setRemoteError('API analytics indisponible.'))
  }, [])

  const localStats = useMemo(() => getAnalyticsStats(localEvents), [localEvents])
  const stats = remoteStats || localStats

  return (
    <main className="page countPage">
      <section className="section">
        <p className="eyebrow">View count</p>
        <h1>Clicks landing page</h1>
        <p className="lead">
          Route cachée pour consulter les clics sur les liens projets depuis la
          landing page.
        </p>
        <p className="analyticsNotice">
          Endpoint: {analyticsEndpoint}. Sans API backend à cette route, les
          chiffres affichés viennent seulement de ce navigateur.
        </p>
        {remoteError && <p className="analyticsNotice">{remoteError}</p>}
      </section>

      <section className="analyticsGrid" aria-label="Statistiques de clics">
        <article>
          <span>Total</span>
          <strong>{stats.total}</strong>
          <p>clics enregistrés</p>
        </article>
        <article>
          <span>Localisations</span>
          <strong>{stats.locations.length}</strong>
          <p>locale / fuseau horaire</p>
        </article>
      </section>

      <section className="section analyticsTable">
        <h2>Localisation</h2>
        {stats.locations.length ? (
          <ul>
            {stats.locations.map((location) => (
              <li key={location.label}>
                <span>{location.label}</span>
                <strong>{location.count}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun clic enregistré.</p>
        )}
      </section>

      <section className="section analyticsTable">
        <h2>Derniers clics</h2>
        {stats.recent.length ? (
          <ul>
            {stats.recent.map((event) => (
              <li key={`${event.timestamp}-${event.id}`}>
                <span>{event.label}</span>
                <strong>{new Date(event.timestamp).toLocaleString('fr-FR')}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun clic enregistré.</p>
        )}
      </section>
    </main>
  )
}

function CvPage() {
  return (
    <main className="page cvPage">
      <section className="section">
        <p className="eyebrow">CV</p>
        <h1>Alexis Othily - Développeur IA</h1>
        <p className="lead">
          Version PDF issue du CV fourni, avec expériences, projets personnels,
          compétences et certifications.
        </p>
        <div className="actions">
          <a className="button primary" href={cvUrl} target="_blank" rel="noreferrer">
            Ouvrir le PDF
          </a>
          <a className="button" href={`mailto:${email}`}>
            Me contacter
          </a>
        </div>
      </section>
      <object className="pdfFrame" data={cvUrl} type="application/pdf">
        <a href={cvUrl}>Ouvrir le CV PDF</a>
      </object>
    </main>
  )
}

const rootRoute = createRootRoute({ component: Layout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const cvRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'cv',
  component: CvPage,
})

const countRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'count',
  component: CountPage,
})

const routeTree = rootRoute.addChildren([indexRoute, cvRoute, countRoute])

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
