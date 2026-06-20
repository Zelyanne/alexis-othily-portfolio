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
const analyticsEndpoint = '/api/analytics'
const analyticsStorageKey = 'alexis-portfolio-clicks'
const analyticsViewSessionKey = 'alexis-portfolio-viewed'

type AnalyticsEvent = {
  href?: string
  id: string
  label: string
  locale: string
  path: string
  timeZone: string
  timestamp: string
  type?: 'click' | 'view'
}

type AnalyticsStats = {
  clicks: number
  persistent?: boolean
  storage?: string
  total: number
  views: number
  locations: Array<{ label: string; count: number }>
  recent: AnalyticsEvent[]
}

type Language = 'fr' | 'en'

const copy = {
  fr: {
    title: 'Alexis Othily - Développeur IA',
    nav: {
      label: 'Navigation principale',
      projects: 'Projets',
      skills: 'Compétences',
      experience: 'Expérience',
      cv: 'CV',
    },
    footer: 'Disponible freelance - Cotonou',
    home: {
      eyebrow: 'Développeur IA - Cotonou',
      h1: 'Agents IA, vision et backend produit.',
      lead:
        'Je conçois des systèmes IA concrets: agents LangGraph, pipelines de données, computer vision et backends Python prêts pour des utilisateurs réels.',
      note:
        'Mon terrain: AI engineering, data analysis et back-end dev pour transformer un besoin métier en système fiable.',
      projectsButton: 'Voir les projets',
      contactButton: 'Me contacter',
      cvButton: 'CV PDF',
      domainsLabel: 'Domaines techniques',
      portraitAlt: "Portrait professionnel d'Alexis Othily",
      status: 'Disponible freelance',
    },
    projectsSection: {
      eyebrow: 'Sélection de travaux',
      h2: 'Des projets IA qui relient modèle, produit et usage.',
      role: 'Rôle',
      impact: 'Impact',
      visit: 'Visiter le site',
    },
    skillsSection: {
      eyebrow: 'Stack',
      h2: 'Une base IA large, avec un cœur Python produit.',
      text:
        "Profil utile quand il faut connecter la recherche appliquée, l'API, les données et une interface exploitable.",
      credentialsLabel: 'Certifications et résultats',
    },
    experienceSection: {
      eyebrow: 'Parcours',
      h2: 'Des expériences proches du terrain.',
    },
    contact: {
      eyebrow: 'Recruteurs & clients',
      h2: "Parlons d'un agent IA, d'une API ou d'un pipeline vision.",
      email: 'Envoyer un email',
    },
    cvPage: {
      eyebrow: 'CV',
      h1: 'Alexis Othily - Développeur IA',
      lead:
        'Version PDF issue du CV fourni, avec expériences, projets personnels, compétences et certifications.',
      open: 'Ouvrir le PDF',
      contact: 'Me contacter',
      fallback: 'Ouvrir le CV PDF',
    },
    count: {
      eyebrow: 'Compteur de vues',
      h1: 'Statistiques landing page',
      lead:
        'Route cachée pour consulter les vues de la landing page, les clics sur les liens projets et les localisations disponibles.',
      noticePrefix: 'Endpoint',
      noticeSuffix:
        'Si le stockage est temporaire, les chiffres peuvent se perdre quand Vercel redémarre la fonction.',
      apiError: 'API analytics indisponible.',
      statsLabel: 'Statistiques de clics',
      storage: 'Stockage',
      persistentStorage: 'Persistant - Upstash Redis',
      temporaryStorage: 'Temporaire - ajoute Upstash Redis sur Vercel pour conserver les vues.',
      views: 'Vues',
      viewsHelp: 'sessions de landing page',
      clicks: 'Clics',
      clicksHelp: 'liens projets',
      locations: 'Localisations',
      locationsHelp: 'locale / fuseau horaire',
      locationTitle: 'Localisation',
      recentTitle: 'Derniers événements',
      empty: 'Aucun événement enregistré.',
      viewEvent: 'Vue',
      clickEvent: 'Clic',
      viewLabel: 'Vue landing page',
    },
  },
  en: {
    title: 'Alexis Othily - AI Developer',
    nav: {
      label: 'Main navigation',
      projects: 'Projects',
      skills: 'Skills',
      experience: 'Experience',
      cv: 'Resume',
    },
    footer: 'Available for freelance - Cotonou',
    home: {
      eyebrow: 'AI Developer - Cotonou',
      h1: 'AI agents, vision and product backend.',
      lead:
        'I build practical AI systems: LangGraph agents, data pipelines, computer vision and Python backends ready for real users.',
      note:
        'My field: AI engineering, data analysis and back-end dev to turn business needs into reliable systems.',
      projectsButton: 'See projects',
      contactButton: 'Contact me',
      cvButton: 'Resume PDF',
      domainsLabel: 'Technical domains',
      portraitAlt: 'Professional portrait of Alexis Othily',
      status: 'Available for freelance',
    },
    projectsSection: {
      eyebrow: 'Selected work',
      h2: 'AI projects connecting model, product and real usage.',
      role: 'Role',
      impact: 'Impact',
      visit: 'Visit site',
    },
    skillsSection: {
      eyebrow: 'Stack',
      h2: 'A broad AI base, with a strong Python product core.',
      text:
        'Useful when applied research, APIs, data and usable product logic need to work together.',
      credentialsLabel: 'Certifications and results',
    },
    experienceSection: {
      eyebrow: 'Experience',
      h2: 'Hands-on experience close to real needs.',
    },
    contact: {
      eyebrow: 'Recruiters & clients',
      h2: "Let's talk about an AI agent, an API or a vision pipeline.",
      email: 'Send email',
    },
    cvPage: {
      eyebrow: 'Resume',
      h1: 'Alexis Othily - AI Developer',
      lead:
        'PDF version from the provided resume, with experience, personal projects, skills and certifications.',
      open: 'Open PDF',
      contact: 'Contact me',
      fallback: 'Open resume PDF',
    },
    count: {
      eyebrow: 'View count',
      h1: 'Landing page analytics',
      lead:
        'Hidden route for checking landing page views, project-link clicks and available locations.',
      noticePrefix: 'Endpoint',
      noticeSuffix:
        'If storage is temporary, numbers can disappear when Vercel restarts the function.',
      apiError: 'Analytics API unavailable.',
      statsLabel: 'Click statistics',
      storage: 'Storage',
      persistentStorage: 'Persistent - Upstash Redis',
      temporaryStorage: 'Temporary - add Upstash Redis on Vercel to keep views.',
      views: 'Views',
      viewsHelp: 'landing page sessions',
      clicks: 'Clicks',
      clicksHelp: 'project links',
      locations: 'Locations',
      locationsHelp: 'locale / time zone',
      locationTitle: 'Location',
      recentTitle: 'Recent events',
      empty: 'No event recorded.',
      viewEvent: 'View',
      clickEvent: 'Click',
      viewLabel: 'Landing page view',
    },
  },
} as const

const projects = [
  {
    slug: 'ai-assistant',
    title: 'AI Assistant - Executive Hub',
    href: 'https://aizelyan.duckdns.org/',
    stack: ['LangGraph', 'TypeScript', 'Mistral', 'MCP'],
    tone: 'teal',
    fr: {
      label: 'Assistant IA',
      title: 'AI Assistant - Executive Hub',
      summary:
        "Agent IA orienté Google Workspace pour orchestrer des tâches bureautiques, connecter des outils et planifier des actions différées.",
      result: 'Orchestration Google Workspace',
      role: 'Architecture agentique',
    },
    en: {
      label: 'AI Assistant',
      title: 'AI Assistant - Executive Hub',
      summary:
        'Google Workspace-oriented AI agent for orchestrating office tasks, connecting tools and scheduling deferred actions.',
      result: 'Google Workspace orchestration',
      role: 'Agent architecture',
    },
  },
  {
    slug: 'lin-automation',
    title: 'Lin - Community Manager IA',
    href: 'https://lin-ai.duckdns.org/',
    stack: ['LangGraph', 'Python', 'Mistral'],
    tone: 'rose',
    fr: {
      label: 'Automatisation',
      title: 'Lin - Community Manager IA',
      summary:
        'Pipeline agentique qui transforme des mots-clés en posts LinkedIn structurés, planifiés et prêts à publier.',
      result: 'Génération + planification',
      role: 'Pipeline IA',
    },
    en: {
      label: 'Automation',
      title: 'Lin - AI Community Manager',
      summary:
        'Agentic pipeline that turns keywords into structured, scheduled LinkedIn posts ready to publish.',
      result: 'Generation + scheduling',
      role: 'AI pipeline',
    },
  },
  {
    slug: 'e-learning',
    title: 'E-learning platform',
    href: 'https://vps-55e5f624.vps.ovh.net/',
    stack: ['Python', 'Flask', 'SQL'],
    tone: 'amber',
    fr: {
      label: 'EdTech',
      title: 'Plateforme e-learning',
      summary:
        'Backend Python/Flask avec gestion utilisateurs, contenus pédagogiques, progression, quiz et évaluations automatiques.',
      result: 'API e-learning complète',
      role: 'Backend produit',
    },
    en: {
      label: 'EdTech',
      title: 'E-learning platform',
      summary:
        'Python/Flask backend with user management, learning content, progress tracking, quizzes and automated evaluations.',
      result: 'Complete e-learning API',
      role: 'Product backend',
    },
  },
] as const

const domains = [
  {
    title: 'AI Engineering',
    tools: ['Python', 'TypeScript', 'LangGraph', 'LangChain', 'Mistral', 'Hugging Face'],
    fr: 'Agents IA, workflows LangGraph, orchestration MCP et modèles appliqués.',
    en: 'AI agents, LangGraph workflows, MCP orchestration and applied models.',
  },
  {
    title: 'Data Analysis',
    tools: ['Python', 'SQL', 'Jupyter', 'Taipy', 'scikit-learn', 'PyTorch'],
    fr: 'Analyse métier, dashboards, modèles ML et restitution de tendances.',
    en: 'Business analysis, dashboards, ML models and trend reporting.',
  },
  {
    title: 'Back end dev',
    tools: ['Python', 'Flask', 'FastAPI', 'Django', 'PostgreSQL', 'Docker'],
    fr: 'APIs, bases de données, auth, logique produit et déploiement applicatif.',
    en: 'APIs, databases, authentication, product logic and app deployment.',
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
    frDate: 'Déc. 2025 - Avr. 2026',
    enDate: 'Dec. 2025 - Apr. 2026',
    title: 'EdTech Program Manager - Neural Bridge',
    fr: "Conception de contenus pédagogiques pour l'apprentissage du code et solutions IA adaptées aux apprenants adultes.",
    en: 'Designed educational content for learning code and adapted AI solutions for adult learners.',
  },
  {
    frDate: 'Mai 2026',
    enDate: 'May 2026',
    frTitle: 'Freelance - Backend e-learning',
    enTitle: 'Freelance - E-learning backend',
    fr: 'Architecture backend Python/Flask, base de données, authentification, progression et modules d’évaluation.',
    en: 'Python/Flask backend architecture, database design, authentication, progress tracking and evaluation modules.',
  },
  {
    frDate: 'Juil. 2024 - Oct. 2024',
    enDate: 'Jul. 2024 - Oct. 2024',
    frTitle: 'Data Scientist stagiaire - AFG Assurances Bénin Vie',
    enTitle: 'Data Scientist intern - AFG Assurances Bénin Vie',
    fr: "Dashboard Taipy, analyse de 3 années de données commerciales et restitution d'insights décisionnels.",
    en: 'Taipy dashboard, analysis of 3 years of sales data and decision-support insights.',
  },
  {
    frDate: 'Oct. 2022 - Jan. 2023',
    enDate: 'Oct. 2022 - Jan. 2023',
    frTitle: 'Data Scientist stagiaire - Holding Bourjon Investment',
    enTitle: 'Data Scientist intern - Holding Bourjon Investment',
    fr: 'PostgreSQL sous Docker, backend FastAPI, optimisation de flux de trésorerie et modèles YOLO en photogrammétrie.',
    en: 'PostgreSQL with Docker, FastAPI backend, cash-flow optimization and YOLO models for photogrammetry.',
  },
]

const credentials = [
  ['Hugging Face', 'Certificate of Excellence - AI Agents'],
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
  let clicks = 0
  let views = 0

  for (const event of events) {
    const type = event.type || 'click'
    if (type === 'view') views += 1
    if (type === 'click') clicks += 1

    const label = `${event.locale || 'locale inconnue'} / ${event.timeZone || 'zone inconnue'}`
    locationCounts.set(label, (locationCounts.get(label) || 0) + 1)
  }

  return {
    clicks,
    total: events.length,
    views,
    locations: [...locationCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recent: [...events].reverse().slice(0, 12),
  }
}

function getDeviceLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

function useCopy() {
  const [language] = useState<Language>(getDeviceLanguage)
  const text = copy[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = text.title
  }, [language, text.title])

  return { language, text }
}

function trackAnalyticsEvent(type: 'click' | 'view', id: string, label: string, href?: string) {
  const event: AnalyticsEvent = {
    href,
    id,
    label,
    locale: navigator.language,
    path: window.location.pathname,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    type,
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

function trackLandingClick(id: string, label: string, href: string) {
  trackAnalyticsEvent('click', id, label, href)
}

function trackLandingView(label: string) {
  if (window.sessionStorage.getItem(analyticsViewSessionKey)) return
  window.sessionStorage.setItem(analyticsViewSessionKey, '1')
  trackAnalyticsEvent('view', 'landing-page', label)
}

function Layout() {
  const { text } = useCopy()

  return (
    <>
      <header className="nav page">
        <Link className="brand" to="/">
          <span aria-hidden="true" />
          Alexis Othily
        </Link>
        <nav aria-label={text.nav.label}>
          <a href="/#projects">{text.nav.projects}</a>
          <a href="/#skills">{text.nav.skills}</a>
          <a href="/#experience">{text.nav.experience}</a>
          <Link to="/cv">{text.nav.cv}</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="footer page">
        <span>{text.footer}</span>
        <a href={`mailto:${email}`}>{email}</a>
      </footer>
    </>
  )
}

function HomePage() {
  const { language, text } = useCopy()

  useEffect(() => {
    trackLandingView(text.count.viewLabel)
  }, [text.count.viewLabel])

  return (
    <main className="page">
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">{text.home.eyebrow}</p>
          <h1>{text.home.h1}</h1>
          <p className="lead">{text.home.lead}</p>
          <p className="heroNote">{text.home.note}</p>
          <div className="actions">
            <a className="button primary" href="#projects">
              {text.home.projectsButton}
            </a>
            <a className="button" href={`mailto:${email}`}>
              {text.home.contactButton}
            </a>
            <Link className="button" to="/cv">
              {text.home.cvButton}
            </Link>
          </div>
          <div className="proof" aria-label={text.home.domainsLabel}>
            {domains.map((domain) => (
              <article className="proofItem" key={domain.title}>
                <h2>{domain.title}</h2>
                <p>{domain[language]}</p>
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
          <img src={portraitUrl} alt={text.home.portraitAlt} />
          <figcaption>{text.home.status}</figcaption>
        </figure>
      </section>

      <section id="projects" className="section">
        <div className="sectionHead">
          <p className="eyebrow">{text.projectsSection.eyebrow}</p>
          <h2>{text.projectsSection.h2}</h2>
        </div>
        <div className="projectGrid">
          {projects.map((project) => (
            <article className={`projectCard ${project.tone}`} key={project.slug}>
              <div>
                <p className="tag">{project[language].label}</p>
                <h3>{project[language].title}</h3>
                <p>{project[language].summary}</p>
              </div>
              <dl className="projectMeta">
                <div>
                  <dt>{text.projectsSection.role}</dt>
                  <dd>{project[language].role}</dd>
                </div>
                <div>
                  <dt>{text.projectsSection.impact}</dt>
                  <dd>{project[language].result}</dd>
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
                {text.projectsSection.visit} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="section split">
        <div>
          <p className="eyebrow">{text.skillsSection.eyebrow}</p>
          <h2>{text.skillsSection.h2}</h2>
          <p className="sectionText">{text.skillsSection.text}</p>
        </div>
        <div className="skillColumn">
          <div className="skillList">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          <div className="credentialList" aria-label={text.skillsSection.credentialsLabel}>
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
          <p className="eyebrow">{text.experienceSection.eyebrow}</p>
          <h2>{text.experienceSection.h2}</h2>
        </div>
        <div className="timeline">
          {experiences.map((experience) => (
            <article key={experience.frTitle || experience.title}>
              <time>{language === 'fr' ? experience.frDate : experience.enDate}</time>
              <h3>{language === 'fr' ? experience.frTitle || experience.title : experience.enTitle || experience.title}</h3>
              <p>{experience[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact">
        <div>
          <p className="eyebrow">{text.contact.eyebrow}</p>
          <h2>{text.contact.h2}</h2>
        </div>
        <div className="contactLinks">
          <a className="button primary" href={`mailto:${email}`}>
            {text.contact.email}
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
  const { language, text } = useCopy()
  const [remoteStats, setRemoteStats] = useState<AnalyticsStats | null>(null)
  const [remoteError, setRemoteError] = useState('')
  const [localEvents, setLocalEvents] = useState<AnalyticsEvent[]>([])

  useEffect(() => {
    setLocalEvents(readLocalAnalyticsEvents())

    const refreshStats = () => {
      fetch(analyticsEndpoint)
        .then((response) => {
          if (!response.ok) throw new Error('analytics unavailable')
          return response.json() as Promise<AnalyticsStats>
        })
        .then((stats) => {
          setRemoteStats(stats)
          setRemoteError('')
        })
        .catch(() => setRemoteError(text.count.apiError))
    }

    refreshStats()
    const timer = window.setInterval(refreshStats, 5000)
    return () => window.clearInterval(timer)
  }, [text.count.apiError])

  const localStats = useMemo(() => getAnalyticsStats(localEvents), [localEvents])
  const stats = remoteStats || localStats

  return (
    <main className="page countPage">
      <section className="section">
        <p className="eyebrow">{text.count.eyebrow}</p>
        <h1>{text.count.h1}</h1>
        <p className="lead">{text.count.lead}</p>
        <p className="analyticsNotice">
          {text.count.noticePrefix}: {analyticsEndpoint}. {text.count.noticeSuffix}
        </p>
        <p className="analyticsNotice">
          {text.count.storage}: {stats.persistent ? text.count.persistentStorage : text.count.temporaryStorage}
        </p>
        {remoteError && <p className="analyticsNotice">{remoteError}</p>}
      </section>

      <section className="analyticsGrid" aria-label={text.count.statsLabel}>
        <article>
          <span>{text.count.views}</span>
          <strong>{stats.views}</strong>
          <p>{text.count.viewsHelp}</p>
        </article>
        <article>
          <span>{text.count.clicks}</span>
          <strong>{stats.clicks}</strong>
          <p>{text.count.clicksHelp}</p>
        </article>
        <article>
          <span>{text.count.locations}</span>
          <strong>{stats.locations.length}</strong>
          <p>{text.count.locationsHelp}</p>
        </article>
      </section>

      <section className="section analyticsTable">
        <h2>{text.count.locationTitle}</h2>
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
          <p>{text.count.empty}</p>
        )}
      </section>

      <section className="section analyticsTable">
        <h2>{text.count.recentTitle}</h2>
        {stats.recent.length ? (
          <ul>
            {stats.recent.map((event) => (
              <li key={`${event.timestamp}-${event.id}`}>
                <span>{event.type === 'view' ? text.count.viewEvent : text.count.clickEvent} - {event.label}</span>
                <strong>{new Date(event.timestamp).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>{text.count.empty}</p>
        )}
      </section>
    </main>
  )
}

function CvPage() {
  const { text } = useCopy()

  return (
    <main className="page cvPage">
      <section className="section">
        <p className="eyebrow">{text.cvPage.eyebrow}</p>
        <h1>{text.cvPage.h1}</h1>
        <p className="lead">{text.cvPage.lead}</p>
        <div className="actions">
          <a className="button primary" href={cvUrl} target="_blank" rel="noreferrer">
            {text.cvPage.open}
          </a>
          <a className="button" href={`mailto:${email}`}>
            {text.cvPage.contact}
          </a>
        </div>
      </section>
      <object className="pdfFrame" data={cvUrl} type="application/pdf">
        <a href={cvUrl}>{text.cvPage.fallback}</a>
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
