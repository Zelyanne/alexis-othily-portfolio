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
import { ArrowButton, FocusRow, Pill, ShadowCard, StatCard } from './components/shadow-ui'
import './styles.css'
import portraitUrl from '../portrait-cutout.webp'

const cvUrl = new URL('../mqjoscgf-Alexis-OTHILY-CV.pdf', import.meta.url).href
const email = 'othilyjose14@gmail.com'
const analyticsEndpoint = '/api/analytics'
const analyticsStorageKey = 'alexis-portfolio-clicks'
const analyticsViewSessionKey = 'alexis-portfolio-viewed'
const analyticsDayMilliseconds = 24 * 60 * 60 * 1000
const analyticsDefaultTo = new Date().toISOString().slice(0, 10)
const analyticsDefaultFrom = new Date(Date.now() - 29 * analyticsDayMilliseconds).toISOString().slice(0, 10)

type AnalyticsPage = 'base' | 'freelance'

type AnalyticsEvent = {
  country?: string
  href?: string
  id: string
  label: string
  locale: string
  location?: string
  page?: AnalyticsPage
  path: string
  referrer?: string
  timeZone: string
  timestamp: string
  type?: 'click' | 'view'
}

type AnalyticsStats = {
  clicks: number
  countries: string[]
  pageViews: Record<AnalyticsPage, number>
  persistent?: boolean
  storage?: string
  total: number
  views: number
  viewSeries: Array<{ date: string; base: number; freelance: number }>
  locations: Array<{ label: string; count: number }>
  recent: AnalyticsEvent[]
}

type Language = 'fr' | 'en'
type VisitorRegion = 'westAfrica' | 'world'

type GeoResponse = {
  pricingRegion?: VisitorRegion
}

const copy = {
  fr: {
    title: 'Alexis Othily - Freelance IA, agents IA, chatbots et automatisation',
    description:
      'Alexis Othily, développeur freelance IA à Cotonou: agents IA, chatbots IA, agents vocaux, automatisation IA, computer vision, signal processing et backends Python.',
    nav: {
      label: 'Navigation principale',
      skip: 'Aller au contenu',
      menu: 'Menu',
      services: 'Offres',
      projects: 'Projets',
      skills: 'Stack',
      experience: 'Expérience',
      contact: 'Contact',
      cv: 'CV',
    },
    footer: 'Disponible freelance - Cotonou',
    home: {
      eyebrow: 'Freelance IA - Cotonou / Afrique de l’Ouest',
      h1: 'Alexis Othily — agents IA, chatbots et automatisation.',
      lead:
        'Je crée des agents IA, chatbots IA, agents vocaux, workflows d’automatisation IA et outils vision/signal qui automatisent les échanges client, les tâches internes et les décisions métier.',
      note:
        'Vous arrivez avec un problème clair; je le transforme en application, API ou agent exploitable par votre équipe.',
      projectsButton: 'Voir mes projets',
      contactButton: 'Demander un devis',
      cvButton: 'CV PDF',
      domainsLabel: 'Domaines techniques',
      portraitAlt: "Portrait professionnel d'Alexis Othily",
      status: 'Disponible freelance',
      stats: {
        projects: 'Projets',
        services: 'Offres',
        experience: 'Expériences',
        skills: 'Compétences',
      },
    },
    servicesSection: {
      eyebrow: 'Offres freelance',
      h2: 'Choisissez le type d’agent dont votre activité a besoin.',
      price: 'Tarif',
      timeline: 'Délais',
      cta: 'Parler de ce projet',
    },
    projectsSection: {
      eyebrow: 'Preuves de travail',
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
      eyebrow: 'Contact',
      h2: "Envoyez le problème à résoudre; je reviens avec une proposition simple.",
      email: 'Envoyer un email',
      response: 'Décrivez le besoin, les outils existants et la zone: Afrique de l’Ouest ou reste du monde.',
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
      directReferrer: 'Accès direct',
      empty: 'Aucun événement enregistré.',
      viewEvent: 'Vue',
      clickEvent: 'Clic',
      viewLabel: 'Vue landing page',
    },
  },
  en: {
    title: 'Alexis Othily - Freelance AI agent developer, chatbots and automation',
    description:
      'Alexis Othily is a freelance AI agent developer in Cotonou building AI agents, AI chatbots, voice agents, AI automation workflows, computer vision, signal processing and Python backends.',
    nav: {
      label: 'Main navigation',
      skip: 'Skip to content',
      menu: 'Menu',
      services: 'Offers',
      projects: 'Projects',
      skills: 'Stack',
      experience: 'Experience',
      contact: 'Contact',
      cv: 'Resume',
    },
    footer: 'Available for freelance - Cotonou',
    home: {
      eyebrow: 'Freelance AI developer - Cotonou / West Africa',
      h1: 'Alexis Othily — AI agents, chatbots and automation.',
      lead:
        'I build AI agents, AI chatbots, voice agents, AI automation workflows and vision/signal tools that automate customer conversations, internal tasks and business decisions.',
      note:
        'Bring a clear business problem; I turn it into an app, API or agent your team can actually use.',
      projectsButton: 'See my work',
      contactButton: 'Request a quote',
      cvButton: 'Resume PDF',
      domainsLabel: 'Technical domains',
      portraitAlt: 'Professional portrait of Alexis Othily',
      status: 'Available for freelance',
      stats: {
        projects: 'Projects',
        services: 'Offers',
        experience: 'Experience',
        skills: 'Skills',
      },
    },
    servicesSection: {
      eyebrow: 'Freelance offers',
      h2: 'Choose the kind of agent your activity needs.',
      price: 'Price',
      timeline: 'Timeline',
      cta: 'Talk about this project',
    },
    projectsSection: {
      eyebrow: 'Work proof',
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
      eyebrow: 'Contact',
      h2: 'Send the problem to solve; I will reply with a simple proposal.',
      email: 'Send email',
      response: 'Describe the need, current tools and region: West Africa or rest of world.',
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
      directReferrer: 'Direct visit',
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
    preview: {
      src: '/project-previews/ai-assistant-hero.jpg',
      fr: "Aperçu du tableau de bord Executive Hub avec les actions de l'assistant IA",
      en: 'Preview of the Executive Hub dashboard with AI assistant actions',
    },
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
    preview: {
      src: '/project-previews/lin-automation-hero.jpg',
      fr: 'Aperçu du workflow de création de contenu et calendrier de Lin',
      en: 'Preview of Lin content creation workflow and calendar',
    },
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
    preview: {
      src: '/project-previews/e-learning-hero.jpg',
      fr: 'Aperçu du portail Nova Academy et de ses parcours de formation',
      en: 'Preview of the Nova Academy portal and learning paths',
    },
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
    frDate: 'Mai 2026',
    enDate: 'May 2026',
    frTitle: 'Freelance - Backend e-learning',
    enTitle: 'Freelance - E-learning backend',
    fr: 'Architecture backend Python/Flask, base de données, authentification, progression et modules d’évaluation.',
    en: 'Python/Flask backend architecture, database design, authentication, progress tracking and evaluation modules.',
  },
  {
    frDate: 'Déc. 2025 - Avr. 2026',
    enDate: 'Dec. 2025 - Apr. 2026',
    title: 'EdTech Program Manager - Neural Bridge',
    fr: "Conception de contenus pédagogiques pour l'apprentissage du code et solutions IA adaptées aux apprenants adultes.",
    en: 'Designed educational content for learning code and adapted AI solutions for adult learners.',
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

const services = [
  {
    id: 'chatbot-app',
    westAfrica: { fr: '200K FCFA', en: '200K FCFA' },
    world: { fr: '600 EUR', en: '600 EUR' },
    timeline: { fr: '2 semaines - 1 mois', en: '2 weeks - 1 month' },
    fr: {
      label: 'Chatbot app / site',
      title: 'Application ou site avec chatbot intelligent',
      summary:
        'Interface chatbot connectée à une connaissance personnalisée: FAQ, documents, offres, process internes ou support client simple.',
    },
    en: {
      label: 'Chatbot app / website',
      title: 'App or website with an intelligent chatbot',
      summary:
        'Chatbot interface connected to personalized knowledge: FAQs, documents, offers, internal processes or simple customer support.',
    },
  },
  {
    id: 'voice-agent',
    westAfrica: { fr: 'à partir de 650K FCFA', en: 'from 650K FCFA' },
    world: { fr: 'à partir de 2000 EUR', en: 'from 2000 EUR' },
    timeline: { fr: '1 - 4 mois', en: '1 - 4 months' },
    fr: {
      label: 'Agent vocal IA',
      title: 'Agent d’appel pour vente ou service client',
      summary:
        'Agent vocal pour qualifier des prospects, répondre aux questions, guider un client et transmettre les conversations utiles à votre équipe.',
    },
    en: {
      label: 'AI voice agent',
      title: 'Calling agent for sales or customer service',
      summary:
        'Voice agent to qualify leads, answer questions, guide customers and pass useful conversations back to your team.',
    },
  },
  {
    id: 'workflow-agent',
    westAfrica: { fr: 'à partir de 450K FCFA', en: 'from 450K FCFA' },
    world: { fr: 'à partir de 1300 EUR', en: 'from 1300 EUR' },
    timeline: { fr: '1 - 3 mois', en: '1 - 3 months' },
    fr: {
      label: 'Workflow complexe',
      title: 'Agent qui gère des workflows multi-étapes',
      summary:
        'Orchestration LangGraph/MCP pour connecter outils, données, API, validations humaines et actions planifiées.',
    },
    en: {
      label: 'Complex workflow',
      title: 'Agent handling multi-step workflows',
      summary:
        'LangGraph/MCP orchestration to connect tools, data, APIs, human validation and scheduled actions.',
    },
  },
  {
    id: 'coding-agent',
    westAfrica: { fr: 'à partir de 300K FCFA', en: 'from 300K FCFA' },
    world: { fr: 'à partir de 1000 EUR', en: 'from 1000 EUR' },
    timeline: { fr: '1 - 3 mois', en: '1 - 3 months' },
    fr: {
      label: 'Agent de travail spécialisé',
      title: 'Agent branché à Codex, Claude Code, Hermes ou OpenClaw',
      summary:
        'Agent personnalisé pour une tâche métier précise: analyse de repo, génération assistée, contrôle qualité ou automatisation répétitive.',
    },
    en: {
      label: 'Specialized work agent',
      title: 'Agent plugged into Codex, Claude Code, Hermes or OpenClaw',
      summary:
        'Personalized agent for a precise work task: repo analysis, assisted generation, quality control or repetitive automation.',
    },
  },
  {
    id: 'vision-signal',
    westAfrica: { fr: 'à partir de 400K FCFA', en: 'from 400K FCFA' },
    world: { fr: 'à partir de 1200 EUR', en: 'from 1200 EUR' },
    timeline: { fr: '1 - 3 mois', en: '1 - 3 months' },
    fr: {
      label: 'Vision & signal',
      title: 'Computer vision ou traitement du signal',
      summary:
        'Détection, classification, analyse d’images, signaux audio ou mesures terrain avec pipeline Python exploitable.',
    },
    en: {
      label: 'Vision & signal',
      title: 'Computer vision or signal processing',
      summary:
        'Detection, classification, image analysis, audio signals or field measurements with a usable Python pipeline.',
    },
  },
] as const

const contactHref = `mailto:${email}?subject=${encodeURIComponent('Projet IA freelance')}`
const westAfricaCountries = new Set([
  'BJ',
  'BF',
  'CV',
  'CI',
  'GM',
  'GH',
  'GN',
  'GW',
  'LR',
  'ML',
  'MR',
  'NE',
  'NG',
  'SN',
  'SL',
  'TG',
])
const westAfricaTimeZones = new Set([
  'Africa/Abidjan',
  'Africa/Accra',
  'Africa/Bamako',
  'Africa/Banjul',
  'Africa/Bissau',
  'Africa/Conakry',
  'Africa/Dakar',
  'Africa/Freetown',
  'Africa/Lagos',
  'Africa/Lome',
  'Africa/Monrovia',
  'Africa/Niamey',
  'Africa/Nouakchott',
  'Africa/Ouagadougou',
  'Africa/Porto-Novo',
  'Atlantic/Cape_Verde',
])

function getVisitorRegion(): VisitorRegion {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (westAfricaTimeZones.has(timeZone)) return 'westAfrica'

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  return languages.some((language) => {
    const country = language.match(/[-_]([A-Z]{2})\b/i)?.[1]?.toUpperCase()
    return country ? westAfricaCountries.has(country) : false
  })
    ? 'westAfrica'
    : 'world'
}

function readLocalAnalyticsEvents() {
  try {
    const raw = window.localStorage.getItem(analyticsStorageKey)
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : []
  } catch {
    return []
  }
}

function getAnalyticsStats(
  events: AnalyticsEvent[],
  from = analyticsDefaultFrom,
  to = analyticsDefaultTo,
  selectedCountry = 'all',
): AnalyticsStats {
  const countries = new Set<string>()
  const dailyViews = new Map<string, { base: number; freelance: number }>()
  const locationCounts = new Map<string, number>()
  const pageViews: Record<AnalyticsPage, number> = { base: 0, freelance: 0 }
  let clicks = 0
  let views = 0

  for (const event of events) {
    const type = event.type || 'click'
    if (type === 'click') clicks += 1
    if (type === 'view') {
      views += 1
      const country = event.country || 'unknown'
      const page = event.page || (event.path?.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base')
      const date = event.timestamp.slice(0, 10)
      countries.add(country)
      pageViews[page] += 1

      if (date >= from && date <= to && (selectedCountry === 'all' || selectedCountry === country)) {
        const point = dailyViews.get(date) || { base: 0, freelance: 0 }
        point[page] += 1
        dailyViews.set(date, point)
      }
    }

    const label = event.location || `${event.locale || 'locale inconnue'} / ${event.timeZone || 'zone inconnue'}`
    locationCounts.set(label, (locationCounts.get(label) || 0) + 1)
  }

  const viewSeries = []
  for (
    let time = Date.parse(`${from}T00:00:00.000Z`);
    time <= Date.parse(`${to}T00:00:00.000Z`);
    time += analyticsDayMilliseconds
  ) {
    const date = new Date(time).toISOString().slice(0, 10)
    viewSeries.push({ date, ...(dailyViews.get(date) || { base: 0, freelance: 0 }) })
  }

  return {
    clicks,
    countries: [...countries].sort(),
    pageViews,
    total: events.length,
    views,
    viewSeries,
    locations: [...locationCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recent: [...events].reverse().slice(0, 12),
  }
}

function getReferrerLabel(referrer: string | undefined, fallback: string) {
  if (!referrer) return fallback
  try {
    return new URL(referrer).hostname
  } catch {
    return referrer
  }
}

function getDeviceLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.append(tag)
  }
  tag.content = content
}

function useCopy() {
  const [language] = useState<Language>(getDeviceLanguage)
  const text = copy[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = text.title
    setMeta('description', text.description)
    setMeta('og:title', text.title, 'property')
    setMeta('og:description', text.description, 'property')
    setMeta('twitter:title', text.title)
    setMeta('twitter:description', text.description)
  }, [language, text.description, text.title])

  return { language, text }
}

function trackAnalyticsEvent(type: 'click' | 'view', id: string, label: string, href?: string) {
  const path = window.location.pathname
  const page: AnalyticsPage = path.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base'
  const event: AnalyticsEvent = {
    country: 'unknown',
    href,
    id,
    label,
    locale: navigator.language,
    location: `${navigator.language} / ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    page,
    path,
    referrer: document.referrer,
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
  const page = window.location.pathname.replace(/\/+$/, '') === '/freelance' ? 'freelance' : 'base'
  const sessionKey = `${analyticsViewSessionKey}:${page}`
  if (window.sessionStorage.getItem(sessionKey)) return
  window.sessionStorage.setItem(sessionKey, '1')
  trackAnalyticsEvent('view', `${page}-page`, label)
}

function Layout() {
  const { language, text } = useCopy()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <a className="skipLink" href="#main-content">
        {text.nav.skip}
      </a>
      <header className="nav page">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brandMark" aria-hidden="true">
            A
          </span>
          <span className="brandName">Alexis Othily</span>
        </Link>
        <button
          className="menuButton"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {text.nav.menu}
        </button>
        <nav id="primary-navigation" className={menuOpen ? 'open' : ''} aria-label={text.nav.label}>
          <a href="/#projects" onClick={() => setMenuOpen(false)}>
            {text.nav.projects}
          </a>
          <a href="/freelance#services" onClick={() => setMenuOpen(false)}>
            {text.nav.services}
          </a>
          <a href="/#skills" onClick={() => setMenuOpen(false)}>
            {text.nav.skills}
          </a>
          <a href="/#experience" onClick={() => setMenuOpen(false)}>
            {text.nav.experience}
          </a>
          <a className="navContact" href="/#contact" onClick={() => setMenuOpen(false)}>
            {text.nav.contact}
          </a>
          <Link to="/cv" onClick={() => setMenuOpen(false)}>
            {text.nav.cv}
          </Link>
        </nav>
        <span
          className="languageControl"
          aria-label={language === 'fr' ? 'Langue actuelle : français' : 'Current language: English'}
        >
          {language.toUpperCase()}
        </span>
        <div className="railProfile">
          <img src={portraitUrl} alt="" />
          <span>{text.home.status}</span>
        </div>
      </header>
      <Outlet />
      <footer className="footer page">
        <span>{text.footer}</span>
        <a href={`mailto:${email}`}>{email}</a>
      </footer>
    </>
  )
}

function HomePage({ showServices = false }: { showServices?: boolean } = {}) {
  const { language, text } = useCopy()
  const [visitorRegion, setVisitorRegion] = useState<VisitorRegion>(getVisitorRegion)
  const [heroName, heroSpecialty = text.home.h1] = text.home.h1.split(' — ')
  const featuredTools = [...new Set(domains.reduce<string[]>((tools, domain) => [...tools, ...domain.tools], []))].slice(0, 8)
  const heroMetrics = [
    { label: text.home.stats.projects, value: String(projects.length) },
    ...(showServices ? [{ label: text.home.stats.services, value: String(services.length) }] : []),
    { label: text.home.stats.experience, value: String(experiences.length) },
    { label: text.home.stats.skills, value: String(skills.length) },
  ]

  useEffect(() => {
    trackLandingView(text.count.viewLabel)
  }, [text.count.viewLabel])

  useEffect(() => {
    if (!showServices) return

    fetch(`${analyticsEndpoint}?geo=1`)
      .then((response) => {
        if (!response.ok) throw new Error('geo unavailable')
        return response.json() as Promise<GeoResponse>
      })
      .then((geo) => {
        if (geo.pricingRegion === 'westAfrica' || geo.pricingRegion === 'world') {
          setVisitorRegion(geo.pricingRegion)
        }
      })
      .catch(() => {
        setVisitorRegion(getVisitorRegion())
      })
  }, [showServices])

  return (
    <main id="main-content" className="page homePage">
      <section className="hero">
        <div className="heroCopy min-w-0">
          <Pill className="eyebrow heroEyebrow">{text.home.eyebrow}</Pill>
          <h1>
            <span className="heroName">{heroName} —</span>
            <span className="heroAccent">{heroSpecialty}</span>
          </h1>
          <p className="lead">{text.home.lead}</p>
          <p className="heroNote">{text.home.note}</p>
          <div className="actions flex flex-wrap">
            <ArrowButton className="button primary" href="#projects">
              {text.home.projectsButton}
            </ArrowButton>
            <ArrowButton className="button" href={contactHref}>
              {text.home.contactButton}
            </ArrowButton>
            <Link className="button" to="/cv">
              {text.home.cvButton}
            </Link>
          </div>
          <div className="techPill flex flex-wrap" aria-label={text.home.domainsLabel}>
            <span>{text.home.domainsLabel}</span>
            {featuredTools.map((tool) => (
              <Pill key={tool}>{tool}</Pill>
            ))}
          </div>
        </div>
        <figure className="portrait heroStage">
          <div className="stageCode" aria-hidden="true">
            <span>{'const solution = {'}</span>
            <span>model: 'applied',</span>
            <span>tools: 'connected',</span>
            <span>{'}'}</span>
          </div>
          <span className="stageOrbit stageOrbitOne" aria-hidden="true" />
          <span className="stageOrbit stageOrbitTwo" aria-hidden="true" />
          <figcaption>{text.home.status}</figcaption>
          <img src={portraitUrl} alt={text.home.portraitAlt} />
          <div className="heroStats grid grid-cols-2">
            {heroMetrics.map((metric) => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </div>
        </figure>
      </section>

      <section className="section focusSection">
        <div className="focusIntro">
          <p className="eyebrow">{text.home.domainsLabel}</p>
          <h2>{text.home.note}</h2>
        </div>
        <div className="focusRows">
          {domains.map((domain, index) => (
            <FocusRow key={domain.title} number={String(index + 1).padStart(2, '0')}>
              <div>
                <h3>{domain.title}</h3>
                <p>{domain[language]}</p>
              </div>
              <div className="focusTools">
                {domain.tools.slice(0, 4).map((tool) => (
                  <Pill key={tool}>{tool}</Pill>
                ))}
              </div>
            </FocusRow>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{text.projectsSection.eyebrow}</p>
            <h2>{text.projectsSection.h2}</h2>
          </div>
        </div>
        <div className="projectGrid">
          {projects.map((project, index) => (
            <ShadowCard className={`projectCard ${project.tone}`} key={project.slug}>
              <span className="cardNumber" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="cardLead">
                <p className="tag">{project[language].label}</p>
                <h3>{project[language].title}</h3>
                <p>{project[language].summary}</p>
              </div>
              <div className="projectVisual">
                <img src={project.preview.src} alt={project.preview[language]} />
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
              <div className="stack flex flex-wrap">
                {project.stack.map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))}
              </div>
              <ArrowButton
                className="projectLink"
                href={project.href}
                onClick={() => trackLandingClick(project.slug, project.title, project.href)}
                target="_blank"
                rel="noreferrer"
              >
                {text.projectsSection.visit}
              </ArrowButton>
            </ShadowCard>
          ))}
        </div>
      </section>

      {showServices && (
        <section id="services" className="section">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{text.servicesSection.eyebrow}</p>
            <h2>{text.servicesSection.h2}</h2>
          </div>
        </div>
        <div className="serviceGrid">
          {services.map((service) => (
            <ShadowCard className="serviceCard" key={service.id}>
              <div>
                <p className="tag">{service[language].label}</p>
                <h3>{service[language].title}</h3>
                <p>{service[language].summary}</p>
              </div>
              <dl className="serviceMeta">
                <div>
                  <dt>{text.servicesSection.price}</dt>
                  <dd>{service[visitorRegion][language]}</dd>
                </div>
                <div>
                  <dt>{text.servicesSection.timeline}</dt>
                  <dd>{service.timeline[language]}</dd>
                </div>
              </dl>
              <ArrowButton
                className="button primary"
                href={`${contactHref}&body=${encodeURIComponent(service[language].title)}`}
              >
                {text.servicesSection.cta}
              </ArrowButton>
            </ShadowCard>
          ))}
        </div>
        </section>
      )}

      <section id="skills" className="section split">
        <div>
          <p className="eyebrow">{text.skillsSection.eyebrow}</p>
          <h2>{text.skillsSection.h2}</h2>
          <p className="sectionText">{text.skillsSection.text}</p>
        </div>
        <div className="skillColumn">
          <div className="skillList flex flex-wrap">
            {skills.map((skill) => (
              <Pill key={skill}>{skill}</Pill>
            ))}
          </div>
          <div className="credentialList" aria-label={text.skillsSection.credentialsLabel}>
            {credentials.map(([source, label]) => (
              <ShadowCard key={label}>
                <span>{source}</span>
                <strong>{label}</strong>
              </ShadowCard>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{text.experienceSection.eyebrow}</p>
            <h2>{text.experienceSection.h2}</h2>
          </div>
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
          <p className="sectionText">{text.contact.response}</p>
        </div>
        <div className="contactLinks">
          <a className="button primary" href={contactHref}>
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
    <main id="main-content" className="page countPage">
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
                <span>
                  {event.type === 'view' ? text.count.viewEvent : text.count.clickEvent} - {event.label} -{' '}
                  {event.location || `${event.locale || 'locale inconnue'} / ${event.timeZone || 'zone inconnue'}`} -{' '}
                  {getReferrerLabel(event.referrer, text.count.directReferrer)}
                </span>
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
    <main id="main-content" className="page cvPage">
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
      <object className="pdfFrame" data={cvUrl} title={text.cvPage.h1} type="application/pdf">
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

const freelanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'freelance',
  component: () => <HomePage showServices />,
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

const routeTree = rootRoute.addChildren([indexRoute, freelanceRoute, cvRoute, countRoute])

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
