import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, Outlet, RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { useCopy } from './copy'
import { analyticsEndpoint, trackLandingClick, trackLandingView } from './analytics'
import { contactHref, credentials, domains, email, experiences, getVisitorRegion, projects, services, skills } from './portfolio-data'
import type { GeoResponse, VisitorRegion } from './portfolio-data'
import { CountPage, CvPage } from './secondary-pages'
import { getHeroScrollProgress } from './hero-motion'
import portraitUrl from '../portrait-cutout.webp'
import './fonts.css'
import './styles.css'

const ui = {
  fr: {
    heroLabel: 'DÉVELOPPEUR IA / COTONOU',
    heroText: 'Agents IA, chatbots et automatisation.',
    heroContact: 'Une idée en tête ?',
    heroCta: 'Parlons de votre projet',
    scroll: 'DÉFILER POUR EXPLORER',
    introLabel: 'INTELLIGENCE ARTIFICIELLE / PRODUIT',
    introTitle: 'Des idées utiles. Des outils qui travaillent.',
    introText: 'De la première idée à une solution utilisable, je conçois des systèmes IA pensés pour vos usages et vos équipes.',
    projectLabel: '01 / PROJETS SÉLECTIONNÉS',
    projectTitle: 'Des idées qui prennent vie.',
    projectIntro: 'Trois projets à la croisée de l’intelligence artificielle, du produit et de l’usage.',
    projectDetails: 'Explorer le projet',
    capabilities: 'Ce que le projet permet',
    servicesLabel: '02 / OFFRES & TARIFS',
    servicesTitle: 'Un périmètre clair. Un prix lisible.',
    servicesIntro: 'Des repères pour démarrer : chaque projet est précisé selon vos besoins et les outils à connecter.',
    regionLabel: 'Afficher les tarifs pour',
    westAfrica: 'Afrique de l’Ouest',
    world: 'International',
    included: 'Périmètre envisagé',
    priceNote: 'Tarifs et délais indicatifs. Périmètre, hébergement, services tiers et maintenance à préciser dans le devis.',
    expertiseLabel: '03 / EXPERTISE',
    expertiseTitle: 'La bonne idée. Les bons outils.',
    expertiseIntro: 'Des modèles aux interfaces, je relie les briques techniques à vos besoins concrets.',
    stack: 'OUTILS & TECHNOLOGIES',
    experienceLabel: '04 / PARCOURS',
    experienceTitle: 'Apprendre en construisant.',
    credentials: 'CERTIFICATIONS & RÉSULTATS',
    contactLabel: '05 / CONTACT',
    contactTitle: 'Une idée en tête ?',
    contactAccent: 'Parlons-en.',
    contactText: 'Décrivez votre besoin, vos outils existants et votre région. Je reviendrai vers vous pour en discuter.',
    email: 'M’écrire',
    top: 'Retour en haut',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  en: {
    heroLabel: 'AI DEVELOPER / COTONOU',
    heroText: 'AI agents, chatbots and automation.',
    heroContact: 'Have an idea in mind?',
    heroCta: 'Let’s discuss your project',
    scroll: 'SCROLL TO EXPLORE',
    introLabel: 'ARTIFICIAL INTELLIGENCE / PRODUCT',
    introTitle: 'Useful ideas. Tools that work.',
    introText: 'From the first idea to a usable solution, I design AI systems around your team and its real needs.',
    projectLabel: '01 / SELECTED PROJECTS',
    projectTitle: 'Ideas brought to life.',
    projectIntro: 'Three projects connecting artificial intelligence, product design and real-world use.',
    projectDetails: 'Explore the project',
    capabilities: 'What the project enables',
    servicesLabel: '02 / SERVICES & PRICING',
    servicesTitle: 'A clear scope. Transparent pricing.',
    servicesIntro: 'Starting points for a conversation: each project is shaped around your needs and the tools to connect.',
    regionLabel: 'Show pricing for',
    westAfrica: 'West Africa',
    world: 'International',
    included: 'Suggested scope',
    priceNote: 'Prices and timelines are indicative. Scope, hosting, third-party services and maintenance are specified in the quote.',
    expertiseLabel: '03 / EXPERTISE',
    expertiseTitle: 'The right idea. The right tools.',
    expertiseIntro: 'From models to interfaces, I connect technical building blocks to practical needs.',
    stack: 'TOOLS & TECHNOLOGIES',
    experienceLabel: '04 / EXPERIENCE',
    experienceTitle: 'Learning by building.',
    credentials: 'CERTIFICATIONS & RESULTS',
    contactLabel: '05 / CONTACT',
    contactTitle: 'Have an idea in mind?',
    contactAccent: 'Let’s talk.',
    contactText: 'Tell me about your needs, current tools and region. I’ll get back to you to discuss your project.',
    email: 'Send an email',
    top: 'Back to top',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
} as const

const projectDetails = {
  'ai-assistant': {
    fr: ['Orchestration de tâches Google Workspace', 'Connexion d’outils via MCP', 'Planification d’actions différées'],
    en: ['Google Workspace task orchestration', 'Tool connections via MCP', 'Scheduled deferred actions'],
  },
  'lin-automation': {
    fr: ['Mots-clés transformés en contenus', 'Posts LinkedIn structurés', 'Planification des publications'],
    en: ['Keywords turned into content', 'Structured LinkedIn posts', 'Post scheduling'],
  },
  'e-learning': {
    fr: ['Gestion des utilisateurs et des contenus', 'Suivi de la progression', 'Quiz et évaluations automatiques'],
    en: ['User and learning-content management', 'Progress tracking', 'Quizzes and automated evaluations'],
  },
} as const

const serviceDetails = {
  'chatbot-app': {
    fr: ['Interface conversationnelle', 'FAQ, documents ou offres personnalisés', 'Support client simple'],
    en: ['Conversational interface', 'Custom FAQs, documents or offers', 'Simple customer support'],
  },
  'voice-agent': {
    fr: ['Qualification de prospects', 'Réponses aux questions courantes', 'Transmission des conversations utiles'],
    en: ['Lead qualification', 'Answers to common questions', 'Useful conversations handed to your team'],
  },
  'workflow-agent': {
    fr: ['Connexion des outils, données et API', 'Étapes et actions planifiées', 'Validation humaine lorsque nécessaire'],
    en: ['Tools, data and API connections', 'Multi-step and scheduled actions', 'Human validation where needed'],
  },
  'coding-agent': {
    fr: ['Agent adapté à une tâche précise', 'Analyse ou génération assistée', 'Contrôle qualité et tâches répétitives'],
    en: ['Agent tailored to a specific task', 'Assisted analysis or generation', 'Quality control and repetitive tasks'],
  },
  'vision-signal': {
    fr: ['Détection et classification', 'Images, audio ou mesures terrain', 'Pipeline Python exploitable'],
    en: ['Detection and classification', 'Images, audio or field measurements', 'A usable Python pipeline'],
  },
} as const

function Layout() {
  const { language, text } = useCopy()
  const [menuOpen, setMenuOpen] = useState(false)
  const labels = ui[language]
  return (
    <>
      <a className="skipLink" href="#main-content">{text.nav.skip}</a>
      <header className="nav" onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false) }}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>Alexis Othily<span>.</span></Link>
        <button className="menuButton" type="button" aria-controls="primary-navigation" aria-expanded={menuOpen}
          aria-label={menuOpen ? labels.closeMenu : labels.openMenu} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : text.nav.menu}
        </button>
        <nav id="primary-navigation" className={menuOpen ? 'open' : ''} aria-label={text.nav.label}>
          <a href="/#projects" onClick={() => setMenuOpen(false)}>{text.nav.projects}</a>
          <a href="/#services" onClick={() => setMenuOpen(false)}>{text.nav.services}</a>
          <a href="/#skills" onClick={() => setMenuOpen(false)}>{text.nav.skills}</a>
          <a href="/#experience" onClick={() => setMenuOpen(false)}>{text.nav.experience}</a>
          <Link to="/cv" onClick={() => setMenuOpen(false)}>{text.nav.cv}</Link>
          <a href="/#contact" onClick={() => setMenuOpen(false)}>{text.nav.contact} ↗</a>
        </nav>
        <span className="languageControl" aria-label={language === 'fr' ? 'Langue actuelle : français' : 'Current language: English'}>{language.toUpperCase()}</span>
      </header>
      <Outlet />
      <footer className="footer page">
        <span>Alexis Othily © {new Date().getFullYear()}</span>
        <span>{text.footer}</span>
        <a href="#main-content">{labels.top} ↑</a>
      </footer>
    </>
  )
}

function HomePage() {
  const { language, text } = useCopy()
  const labels = ui[language]
  const [visitorRegion, setVisitorRegion] = useState<VisitorRegion>(getVisitorRegion)
  const regionChosen = useRef(false)
  const heroScene = useRef<HTMLElement>(null)

  useEffect(() => {
    trackLandingView(text.count.viewLabel)
  }, [text.count.viewLabel])

  useEffect(() => {
    let active = true
    fetch(`${analyticsEndpoint}?geo=1`)
      .then((response) => {
        if (!response.ok) throw new Error('geo unavailable')
        return response.json() as Promise<GeoResponse>
      })
      .then((geo) => {
        if (active && !regionChosen.current && (geo.pricingRegion === 'westAfrica' || geo.pricingRegion === 'world')) {
          setVisitorRegion(geo.pricingRegion)
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => {
    const scene = heroScene.current
    const stage = scene?.querySelector<HTMLElement>('.heroStage')
    if (!scene || !stage) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const paint = () => {
      frame = 0
      const progress = reducedMotion.matches ? 0 : getHeroScrollProgress(scene.getBoundingClientRect().top, scene.offsetHeight, stage.offsetHeight)
      scene.style.setProperty('--hero-progress', progress.toFixed(4))
    }
    const requestPaint = () => { if (!frame) frame = window.requestAnimationFrame(paint) }
    paint()
    window.addEventListener('scroll', requestPaint, { passive: true })
    window.addEventListener('resize', requestPaint, { passive: true })
    reducedMotion.addEventListener('change', requestPaint)
    return () => {
      window.removeEventListener('scroll', requestPaint)
      window.removeEventListener('resize', requestPaint)
      reducedMotion.removeEventListener('change', requestPaint)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main id="main-content" className="homePage">
      <section className="heroScene" ref={heroScene} aria-label={text.home.h1}>
        <div className="heroStage">
          <h1 className="srOnly">{text.home.h1}</h1>
          <div className="heroName" aria-hidden="true">alexis</div>
          <img className="heroPortrait" src={portraitUrl} alt={text.home.portraitAlt} />
          <div className="heroOutline" aria-hidden="true">othily</div>
          <div className="heroCaption"><span className="eyebrow">{labels.heroLabel}</span><p>{labels.heroText}</p></div>
          <a className="heroContact" href="#contact"><span>{labels.heroContact}</span><strong>{labels.heroCta} ↗</strong></a>
          <span className="scrollHint" aria-hidden="true">{labels.scroll} ↓</span>
        </div>
      </section>

      <section className="intro section page">
        <p className="eyebrow">{labels.introLabel}</p>
        <div><h2>{labels.introTitle}</h2><p>{labels.introText}</p></div>
      </section>

      <section id="projects" className="section page">
        <div className="sectionHead"><div><p className="eyebrow">{labels.projectLabel}</p><h2>{labels.projectTitle}</h2></div><p>{labels.projectIntro}</p></div>
        <div className="projectGrid">
          {projects.map((project, index) => (
            <article className="projectCard" key={project.slug}>
              <a className="projectVisual" href={project.href} target="_blank" rel="noreferrer"
                onClick={() => trackLandingClick(project.slug, project.title, project.href)}>
                <img src={project.preview.src} alt={project.preview[language]} loading="lazy" width="1470" height="745" />
                <span aria-hidden="true">↗</span>
              </a>
              <div className="cardTop"><span>{String(index + 1).padStart(2, '0')} / {project[language].label}</span><span>↗</span></div>
              <h3>{project[language].title}</h3>
              <p className="projectSummary">{project[language].summary}</p>
              <dl className="projectMeta"><div><dt>{text.projectsSection.role}</dt><dd>{project[language].role}</dd></div><div><dt>{text.projectsSection.impact}</dt><dd>{project[language].result}</dd></div></dl>
              <div className="tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              <details className="projectDetails"><summary>{labels.projectDetails} <span aria-hidden="true">＋</span></summary><p>{labels.capabilities}</p><ul>{projectDetails[project.slug][language].map((item) => <li key={item}>{item}</li>)}</ul>
                <a href={project.href} target="_blank" rel="noreferrer" onClick={() => trackLandingClick(project.slug, project.title, project.href)}>{text.projectsSection.visit} ↗</a>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="section page">
        <div className="sectionHead"><div><p className="eyebrow">{labels.servicesLabel}</p><h2>{labels.servicesTitle}</h2></div><p>{labels.servicesIntro}</p></div>
        <div className="pricingRegion" role="group" aria-label={labels.regionLabel}>
          <span>{labels.regionLabel}</span>
          {(['westAfrica', 'world'] as const).map((region) => <button type="button" key={region} aria-pressed={visitorRegion === region}
            onClick={() => { regionChosen.current = true; setVisitorRegion(region) }}>{labels[region]}</button>)}
        </div>
        <div className="serviceGrid">
          {services.map((service, index) => (
            <article className="serviceCard" key={service.id}>
              <div className="serviceHeading"><span className="eyebrow">{String(index + 1).padStart(2, '0')} / {service[language].label}</span><span aria-hidden="true">↗</span></div>
              <h3>{service[language].title}</h3><p>{service[language].summary}</p>
              <div className="serviceScope"><span className="eyebrow">{labels.included}</span><ul>{serviceDetails[service.id][language].map((item) => <li key={item}>{item}</li>)}</ul></div>
              <dl className="serviceMeta"><div><dt>{text.servicesSection.price}</dt><dd>{service[visitorRegion][language]}</dd></div><div><dt>{text.servicesSection.timeline}</dt><dd>{service.timeline[language]}</dd></div></dl>
              <a className="serviceLink" href={`${contactHref}&body=${encodeURIComponent(service[language].title)}`}>{text.servicesSection.cta} <span>↗</span></a>
            </article>
          ))}
        </div>
        <p className="pricingNote">{labels.priceNote}</p>
      </section>

      <section id="skills" className="section page">
        <div className="sectionHead"><div><p className="eyebrow">{labels.expertiseLabel}</p><h2>{labels.expertiseTitle}</h2></div><p>{labels.expertiseIntro}</p></div>
        <div className="expertiseList">{domains.map((domain, index) => <article key={domain.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{domain.title}</h3><p>{domain[language]}</p></div><span aria-hidden="true">↗</span></article>)}</div>
        <div className="stackArea"><span className="eyebrow">{labels.stack}</span><div className="tags">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
      </section>

      <section id="experience" className="section page">
        <div className="sectionHead"><div><p className="eyebrow">{labels.experienceLabel}</p><h2>{labels.experienceTitle}</h2></div></div>
        <div className="timeline">{experiences.map((experience) => <article key={experience.frTitle || experience.title}><time>{language === 'fr' ? experience.frDate : experience.enDate}</time><div><h3>{language === 'fr' ? experience.frTitle || experience.title : experience.enTitle || experience.title}</h3><p>{experience[language]}</p></div></article>)}</div>
        <div className="credentials"><span className="eyebrow">{labels.credentials}</span><div>{credentials.map(([source, label]) => <p key={label}><strong>{source}</strong> {label}</p>)}</div></div>
      </section>

      <section id="contact" className="contact section page">
        <p className="eyebrow">{labels.contactLabel}</p><h2>{labels.contactTitle}<br /><em>{labels.contactAccent}</em></h2><p className="contactText">{labels.contactText}</p>
        <div className="contactLinks"><a className="contactEmail" href={contactHref}>{email} <span>↗</span></a><div><a href="tel:+2290191112696">+229 01 91 11 26 96 ↗</a><a href="https://github.com/Zelyanne" target="_blank" rel="noreferrer">GitHub ↗</a></div></div>
      </section>
    </main>
  )
}

const rootRoute = createRootRoute({ component: Layout })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const freelanceRoute = createRoute({ getParentRoute: () => rootRoute, path: 'freelance', component: HomePage })
const cvRoute = createRoute({ getParentRoute: () => rootRoute, path: 'cv', component: CvPage })
const countRoute = createRoute({ getParentRoute: () => rootRoute, path: 'count', component: CountPage })
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute, freelanceRoute, cvRoute, countRoute]), defaultPreload: 'intent' })

declare module '@tanstack/react-router' { interface Register { router: typeof router } }

createRoot(document.getElementById('root')!).render(<StrictMode><RouterProvider router={router} /></StrictMode>)
