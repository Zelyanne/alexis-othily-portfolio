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
    details: {
      fr: {
        type: 'Agent IA multi-outils',
        description: 'Assistant exécutif intégré à un tableau de bord métier. L’utilisateur décrit son objectif en langage naturel ; l’agent le décompose en étapes, choisit les outils Google Workspace adaptés, puis prépare ou coordonne les actions nécessaires.',
        highlights: ['Compréhension de demandes métier en langage naturel', 'Création et mise à jour de contenus dans Docs, Sheets et Slides', 'Connexion d’outils et de services via MCP', 'Planification d’actions avec validation humaine'],
      },
      en: {
        type: 'Multi-tool AI agent',
        description: 'Executive assistant embedded in a business dashboard. The user describes an objective in natural language; the agent breaks it into steps, selects the right Google Workspace tools, then prepares or coordinates the required actions.',
        highlights: ['Natural-language understanding of business requests', 'Creating and updating content in Docs, Sheets and Slides', 'Tool and service connections through MCP', 'Scheduled actions with human validation'],
      },
    },
    fr: {
      label: 'Assistant IA',
      title: 'AI Assistant - Executive Hub',
      summary:
        "Agent IA orienté Google Workspace pour orchestrer des tâches bureautiques, connecter des outils et planifier des actions différées.",
      result: 'Orchestration Google Workspace',
      role: 'Agent IA multi-outils',
    },
    en: {
      label: 'AI Assistant',
      title: 'AI Assistant - Executive Hub',
      summary:
        'Google Workspace-oriented AI agent for orchestrating office tasks, connecting tools and scheduling deferred actions.',
      result: 'Google Workspace orchestration',
      role: 'Multi-tool AI agent',
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
    details: {
      fr: {
        type: 'Agent IA d’automatisation',
        description: 'Agent de community management qui transforme un thème, une audience et quelques objectifs en campagne de contenu. Il propose les angles éditoriaux, rédige les posts, organise les variantes et prépare un calendrier prêt à être utilisé.',
        highlights: ['Génération de contenus à partir d’un brief court', 'Proposition d’angles et de formats éditoriaux', 'Structuration de posts LinkedIn prêts à relire', 'Calendrier éditorial et planification'],
      },
      en: {
        type: 'AI automation agent',
        description: 'Community-management agent that turns a topic, an audience and a few goals into a content campaign. It proposes editorial angles, writes the posts, organizes variations and prepares a usable publishing calendar.',
        highlights: ['Content generation from a short brief', 'Editorial-angle and format suggestions', 'Structured LinkedIn posts ready for review', 'Editorial calendar and scheduling'],
      },
    },
    fr: {
      label: 'Automatisation',
      title: 'Lin - Community Manager IA',
      summary:
        'Pipeline agentique qui transforme des mots-clés en posts LinkedIn structurés, planifiés et prêts à publier.',
      result: 'Génération + planification',
      role: 'Agent IA d’automatisation',
    },
    en: {
      label: 'Automation',
      title: 'Lin - AI Community Manager',
      summary:
        'Agentic pipeline that turns keywords into structured, scheduled LinkedIn posts ready to publish.',
      result: 'Generation + scheduling',
      role: 'AI automation agent',
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
    details: {
      fr: {
        type: 'Plateforme EdTech',
        description: 'Plateforme e-learning où les apprenants accèdent à leurs parcours, suivent des modules et passent des quiz. Le backend gère les comptes, les contenus, les résultats et la progression, tandis que les administrateurs peuvent organiser l’offre pédagogique.',
        highlights: ['Comptes utilisateurs et authentification', 'Gestion des cours, modules et ressources', 'Suivi individuel de la progression', 'Quiz, résultats et évaluations automatisées'],
      },
      en: {
        type: 'EdTech platform',
        description: 'E-learning platform where learners access learning paths, complete modules and take quizzes. The backend manages accounts, content, results and progress, while administrators organize the learning offering.',
        highlights: ['User accounts and authentication', 'Course, module and resource management', 'Individual progress tracking', 'Quizzes, results and automated evaluations'],
      },
    },
    fr: {
      label: 'EdTech',
      title: 'Plateforme e-learning',
      summary:
        'Backend Python/Flask avec gestion utilisateurs, contenus pédagogiques, progression, quiz et évaluations automatiques.',
      result: 'API e-learning complète',
      role: 'Plateforme EdTech',
    },
    en: {
      label: 'EdTech',
      title: 'E-learning platform',
      summary:
        'Python/Flask backend with user management, learning content, progress tracking, quizzes and automated evaluations.',
      result: 'Complete e-learning API',
      role: 'EdTech platform',
    },
  },
  {
    slug: 'cahier-du-soir',
    title: 'Cahier du Soir',
    href: null,
    preview: null,
    stack: ['Flutter', 'NestJS', 'LangGraph', 'TypeScript'],
    details: {
      fr: {
        type: 'Tuteur IA agentique',
        description: 'Application mobile et web pour réviser avec un tuteur IA. L’élève démarre une séance à partir d’une leçon ou d’un exercice ; le tuteur pose des questions, analyse les réponses, propose des indices graduels et termine par un récapitulatif de progression.',
        highlights: ['Séances pédagogiques guidées étape par étape', 'Questions adaptées au contenu étudié', 'Évaluation des réponses et indices progressifs', 'Historique et suivi de progression sur mobile et web'],
      },
      en: {
        type: 'Agentic AI tutor',
        description: 'Mobile and web revision app built around an AI tutor. A learner starts a session from a lesson or exercise; the tutor asks questions, analyzes answers, provides progressive hints and ends with a progress recap.',
        highlights: ['Step-by-step guided learning sessions', 'Questions adapted to the studied material', 'Answer assessment and progressive hints', 'History and progress tracking across mobile and web'],
      },
    },
    fr: { label: 'Éducation', title: 'Cahier du Soir', summary: 'Application éducative avec tutorat IA guidé, suivi de progression et parcours de révision personnalisés.', role: 'Tuteur IA agentique', result: 'Tutorat IA personnalisé' },
    en: { label: 'Education', title: 'Cahier du Soir', summary: 'Educational app with guided AI tutoring, progress tracking and personalized revision paths.', role: 'Agentic AI tutor', result: 'Personalized AI tutoring' },
  },
  {
    slug: 'nixia',
    title: 'Nixia',
    href: 'https://www.nixia.app/',
    preview: null,
    stack: ['Python', 'TypeScript', 'vLLM', 'SGLang', 'MCP'],
    details: {
      fr: {
        type: 'Assistant IA généraliste',
        description: 'Assistant conversationnel comparable dans son usage à ChatGPT ou Claude, mais pensé comme un espace de travail complet. L’utilisateur peut discuter, analyser des fichiers, produire des documents et confier une demande complexe à des agents spécialisés qui sélectionnent les outils nécessaires.',
        highlights: ['Conversations multi-étapes et compréhension de documents', 'Création et analyse de documents, présentations et feuilles de calcul', 'Orchestration Google Workspace et outils connectés', 'Coordination d’agents spécialisés selon la tâche', 'Inférence optimisée avec vLLM et SGLang'],
      },
      en: {
        type: 'General-purpose AI assistant',
        description: 'Conversational assistant similar in use to ChatGPT or Claude, but designed as a complete workspace. Users can chat, analyze files, produce documents and delegate complex requests to specialized agents that select the required tools.',
        highlights: ['Multi-step conversations and document understanding', 'Creating and analyzing documents, presentations and spreadsheets', 'Google Workspace and connected-tool orchestration', 'Specialized-agent coordination based on the task', 'Inference optimized with vLLM and SGLang'],
      },
    },
    fr: { label: 'Espace de travail IA', title: 'Nixia', summary: 'Assistant IA conversationnel dans l’esprit de ChatGPT ou Claude, enrichi d’agents spécialisés, d’outils connectés et d’une inférence optimisée.', role: 'Assistant IA généraliste', result: 'Orchestration Google Workspace' },
    en: { label: 'AI workspace', title: 'Nixia', summary: 'Conversational AI assistant similar in use to ChatGPT or Claude, enhanced with specialized agents, connected tools and optimized inference.', role: 'General-purpose AI assistant', result: 'Google Workspace orchestration' },
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
