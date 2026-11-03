export type VisitorRegion = 'westAfrica' | 'world'
export type GeoResponse = { pricingRegion?: VisitorRegion }
export const email = 'othilyjose14@gmail.com'
export const huggingFaceHref = 'https://huggingface.co/Zelyanoth'

export const projects = [
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
  {
    slug: 'cahier-du-soir',
    title: 'Cahier du Soir',
    href: null,
    preview: null,
    stack: [],
    fr: { label: 'Éducation', title: 'Cahier du Soir', summary: 'Une application éducative pour accompagner les apprentissages et les révisions.', role: 'Développement produit', result: 'Apprentissage et révision' },
    en: { label: 'Education', title: 'Cahier du Soir', summary: 'An educational app supporting learning and revision.', role: 'Product development', result: 'Learning and revision' },
  },
  {
    slug: 'nixia',
    title: 'Nixia',
    href: 'https://www.nixia.app/',
    preview: null,
    stack: [],
    fr: { label: 'Espace de travail IA', title: 'Nixia', summary: 'Un espace de travail et assistant IA pour accompagner les tâches du quotidien.', role: 'Développement produit', result: 'Travail au quotidien' },
    en: { label: 'AI workspace', title: 'Nixia', summary: 'An AI workspace and assistant supporting everyday work.', role: 'Product development', result: 'Everyday work' },
  },
] as const

export const domains = [
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

export const skills = [
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

export const experiences = [
  {
    frDate: 'Contrat de prestation - Aujourd’hui',
    enDate: 'Independent contract - Current',
    frTitle: 'Développeur IA Freelance - Harnix | Calavi',
    enTitle: 'Freelance AI Developer - Harnix | Calavi',
    fr: 'Architecture du harness agentique de Nixia : sélection des modèles et orchestration d’agents spécialisés. Optimisation de l’inférence, triplant ainsi la vitesse d’exécution des requêtes.',
    en: 'Architecture of Nixia’s agent harness, covering model selection and specialized-agent orchestration. Inference optimization tripled request execution speed.',
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

export const credentials = [
  ['Hugging Face', 'Certificate of Excellence - AI Agents', huggingFaceHref],
  ['Zindi', '8e / 70 - Your Voice, Your Device, Your Language', 'https://zindi.africa/zc/xoHPRGQ'],
  ['Zindi', '47e / 245 - CGIAR Root Volume Estimation', 'https://zindi.africa/zc/2XHGm9W'],
] as const

export const services = [
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

export const contactHref = `mailto:${email}?subject=${encodeURIComponent('Projet IA freelance')}`
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

export function getVisitorRegion(): VisitorRegion {
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
