import { useEffect, useState } from 'react'

export type Language = 'fr' | 'en'

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
        'Mon parcours, mes projets et mes certifications. Mise en page du CV d’origine conservée, avec mon poste actuel de développeur IA chez Harnix.',
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
      statsLabel: 'Statistiques analytics',
      storage: 'Stockage',
      persistentStorage: 'Persistant - Upstash Redis',
      temporaryStorage: 'Temporaire - ajoute Upstash Redis sur Vercel pour conserver les vues.',
      views: 'Vues',
      viewsHelp: 'sessions de landing page',
      baseViews: 'Chemin principal',
      baseViewsHelp: 'vues depuis la mise en ligne du suivi séparé',
      freelanceViews: 'Chemin freelance',
      freelanceViewsHelp: 'vues depuis la mise en ligne du suivi séparé',
      clicks: 'Clics',
      clicksHelp: 'liens projets',
      locations: 'Localisations',
      locationsHelp: 'locale / fuseau horaire',
      locationTitle: 'Localisation',
      recentTitle: 'Derniers événements',
      splitNotice: 'La séparation principal / freelance commence avec cette version.',
      chartTitle: 'Évolution des vues',
      chartDescription: 'Vues quotidiennes du chemin principal et du chemin freelance',
      countryFilter: 'Pays',
      allCountries: 'Tous les pays',
      unknownCountry: 'Pays inconnu',
      fromDate: 'Du',
      toDate: 'Au',
      baseLegend: 'Principal',
      freelanceLegend: 'Freelance',
      basePage: 'Chemin principal',
      freelancePage: 'Chemin freelance',
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
        'My experience, projects and certifications. The original CV layout is preserved, with my current AI developer role at Harnix.',
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
      statsLabel: 'Analytics statistics',
      storage: 'Storage',
      persistentStorage: 'Persistent - Upstash Redis',
      temporaryStorage: 'Temporary - add Upstash Redis on Vercel to keep views.',
      views: 'Views',
      viewsHelp: 'landing page sessions',
      baseViews: 'Main path',
      baseViewsHelp: 'views since split tracking went live',
      freelanceViews: 'Freelance path',
      freelanceViewsHelp: 'views since split tracking went live',
      clicks: 'Clicks',
      clicksHelp: 'project links',
      locations: 'Locations',
      locationsHelp: 'locale / time zone',
      locationTitle: 'Location',
      recentTitle: 'Recent events',
      splitNotice: 'The main / freelance split starts with this version.',
      chartTitle: 'View evolution',
      chartDescription: 'Daily views for the main and freelance paths',
      countryFilter: 'Country',
      allCountries: 'All countries',
      unknownCountry: 'Unknown country',
      fromDate: 'From',
      toDate: 'To',
      baseLegend: 'Main',
      freelanceLegend: 'Freelance',
      basePage: 'Main path',
      freelancePage: 'Freelance path',
      directReferrer: 'Direct visit',
      empty: 'No event recorded.',
      viewEvent: 'View',
      clickEvent: 'Click',
      viewLabel: 'Landing page view',
    },
  },
} as const

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

export function useCopy() {
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
