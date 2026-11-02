import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, Outlet, RouterProvider, createRootRoute, createRoute, createRouter, useRouterState } from '@tanstack/react-router'
import { useCopy } from './copy'
import { analyticsEndpoint, trackLandingClick, trackLandingView } from './analytics'
import { contactHref, credentials, domains, email, experiences, getVisitorRegion, huggingFaceHref, projects, services, skills } from './portfolio-data'
import type { GeoResponse, VisitorRegion } from './portfolio-data'
import { CountPage, CvPage } from './secondary-pages'
import { getHeroPointerPosition } from './hero-motion'
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
    introText: 'Développeur IA chez Harnix, basé à Cotonou. Je conçois des systèmes IA pensés pour vos usages et vos équipes, de la première idée à une solution utilisable.',
    projectLabel: '01 / PROJETS SÉLECTIONNÉS',
    projectTitle: 'Des idées qui prennent vie.',
    projectIntro: 'Des projets à la croisée de l’intelligence artificielle, du produit et de l’usage.',
    projectDetails: 'Lire les détails',
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
    viewCv: 'Voir mon CV',
    viewCertificate: 'Voir le certificat',
    viewProfile: 'Voir mon profil',
    certificates: 'Mes certifications',
    contactLabel: '05 / CONTACT',
    contactTitle: 'Une idée en tête ?',
    contactAccent: 'Parlons-en.',
    contactText: 'Décrivez votre besoin, vos outils existants et votre région. Je reviendrai vers vous pour en discuter.',
    email: 'M’écrire',
    top: 'Retour en haut',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    heroTitle: 'IA appliquée. Produits utiles.',
    heroDescription: 'Je conçois des agents IA, des outils de vision et des backends Python qui transforment un besoin métier clair en application réellement exploitable.',
    heroProjects: 'Explorer mes réalisations',
    heroDomains: 'Conception et développement',
    heroProof: 'Voix, appareils et langues',
    featured: 'Projet phare',
    copyEmail: 'Copier l’email',
    copiedEmail: 'Email copié',
    copyFailed: 'Impossible de copier : sélectionnez l’adresse email.',
    contactDetails: 'Coordonnées',
  },
  en: {
    heroLabel: 'AI DEVELOPER / COTONOU',
    heroText: 'AI agents, chatbots and automation.',
    heroContact: 'Have an idea in mind?',
    heroCta: 'Let’s discuss your project',
    scroll: 'SCROLL TO EXPLORE',
    introLabel: 'ARTIFICIAL INTELLIGENCE / PRODUCT',
    introTitle: 'Useful ideas. Tools that work.',
    introText: 'AI developer at Harnix, based in Cotonou. From the first idea to a usable solution, I design AI systems around your team and its real needs.',
    projectLabel: '01 / SELECTED PROJECTS',
    projectTitle: 'Ideas brought to life.',
    projectIntro: 'Projects connecting artificial intelligence, product design and real-world use.',
    projectDetails: 'Read the details',
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
    viewCv: 'View my CV',
    viewCertificate: 'View certificate',
    viewProfile: 'View my profile',
    certificates: 'My certifications',
    contactLabel: '05 / CONTACT',
    contactTitle: 'Have an idea in mind?',
    contactAccent: 'Let’s talk.',
    contactText: 'Tell me about your needs, current tools and region. I’ll get back to you to discuss your project.',
    email: 'Send an email',
    top: 'Back to top',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    heroTitle: 'Applied AI. Useful products.',
    heroDescription: 'I build AI agents, vision tools and Python backends that turn a clear business need into an application people can actually use.',
    heroProjects: 'Explore my work',
    heroDomains: 'Design and development',
    heroProof: 'Voice, devices and languages',
    featured: 'Featured project',
    copyEmail: 'Copy email',
    copiedEmail: 'Email copied',
    copyFailed: 'Unable to copy: please select the email address.',
    contactDetails: 'Contact details',
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
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isHome = pathname === '/' || pathname.replace(/\/+$/, '') === '/freelance'
  const isFreelance = pathname.replace(/\/+$/, '') === '/freelance'
  const [headerVisible, setHeaderVisible] = useState(!isHome)
  const labels = ui[language]

  useEffect(() => {
    setMenuOpen(false)
    if (!isHome) {
      setHeaderVisible(true)
      return
    }
    const hero = document.getElementById('top')
    if (!hero) return
    const update = () => setHeaderVisible(hero.getBoundingClientRect().bottom <= 0)
    update()
    if (typeof globalThis.IntersectionObserver === 'function') {
      const observer = new IntersectionObserver(update, { threshold: 0 })
      observer.observe(hero)
      return () => observer.disconnect()
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [isHome, pathname])

  useEffect(() => {
    if (!headerVisible) setMenuOpen(false)
  }, [headerVisible])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [menuOpen])

  return (
    <>
      <a className="skipLink" href="#main-content">{text.nav.skip}</a>
      <header className={`nav${headerVisible ? ' isVisible' : ''}`} inert={!headerVisible}
        aria-hidden={!headerVisible} onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false) }}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}><span className="brandMark" />Alexis Othily</Link>
        <button className="menuButton" type="button" aria-controls="primary-navigation" aria-expanded={menuOpen}
          aria-label={menuOpen ? labels.closeMenu : labels.openMenu} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : text.nav.menu}
        </button>
        <nav id="primary-navigation" className={menuOpen ? 'open' : ''} aria-label={text.nav.label}>
          <a href={isHome ? '#projects' : '/#projects'} onClick={() => setMenuOpen(false)}>{text.nav.projects}</a>
          <a href={isFreelance ? '#services' : '/freelance#services'} onClick={() => setMenuOpen(false)}>{text.nav.services}</a>
          <a href={isHome ? '#skills' : '/#skills'} onClick={() => setMenuOpen(false)}>{text.nav.skills}</a>
          <a href={isHome ? '#experience' : '/#experience'} onClick={() => setMenuOpen(false)}>{text.nav.experience}</a>
          <Link to="/cv" onClick={() => setMenuOpen(false)}>{text.nav.cv}</Link>
          <a href={isHome ? '#contact' : '/#contact'} onClick={() => setMenuOpen(false)}>{text.nav.contact}</a>
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

function HomePage({ showServices }: { showServices: boolean }) {
  const { language, text } = useCopy()
  const labels = ui[language]
  const [visitorRegion, setVisitorRegion] = useState<VisitorRegion>(getVisitorRegion)
  const regionChosen = useRef(false)
  const heroScene = useRef<HTMLElement>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)

  useEffect(() => {
    trackLandingView(text.count.viewLabel)
  }, [text.count.viewLabel])

  useEffect(() => {
    if (!showServices) return
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
  }, [showServices])

  useEffect(() => {
    const scene = heroScene.current
    if (!scene) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let clientX = 0
    let clientY = 0
    const reset = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      for (const key of ['portrait-x', 'portrait-y', 'card-x', 'card-y']) scene.style.setProperty(`--${key}`, '0px')
    }
    const move = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === 'touch') return
      clientX = event.clientX
      clientY = event.clientY
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const bounds = scene.getBoundingClientRect()
        const { x, y } = getHeroPointerPosition(clientX - bounds.left, clientY - bounds.top, bounds.width, bounds.height)
        scene.style.setProperty('--portrait-x', `${x * 10}px`)
        scene.style.setProperty('--portrait-y', `${y * 7}px`)
        scene.style.setProperty('--card-x', `${x * -8}px`)
        scene.style.setProperty('--card-y', `${y * -6}px`)
        frame = 0
      })
    }
    scene.addEventListener('pointermove', move)
    scene.addEventListener('pointerleave', reset)
    reducedMotion.addEventListener('change', reset)
    return () => {
      scene.removeEventListener('pointermove', move)
      scene.removeEventListener('pointerleave', reset)
      reducedMotion.removeEventListener('change', reset)
      reset()
    }
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  async function copyEmail() {
    let copied = false
    try {
      await navigator.clipboard.writeText(email)
      copied = true
    } catch {
      const input = document.createElement('textarea')
      input.value = email
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.append(input)
      input.select()
      try { copied = document.execCommand('copy') } catch { copied = false }
      input.remove()
    }
    setToast(copied ? labels.copiedEmail : labels.copyFailed)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2500)
  }

  return (
    <main id="main-content" className="homePage">
      <section id="top" className="heroScene" ref={heroScene} aria-labelledby="hero-title">
        <div className="heroName" aria-hidden="true">ALEXIS</div>
        <div className="heroCopy">
          <p className="eyebrow">{labels.heroLabel}</p>
          <h1 id="hero-title">{labels.heroTitle}</h1>
          <p>{labels.heroDescription}</p>
          <div className="heroActions">
            <a className="button primary" href="#projects">{labels.heroProjects}</a>
            <a className="textLink" href="#contact">{labels.email} ↗</a>
            <Link className="textLink" to="/cv">{labels.viewCv} ↗</Link>
          </div>
        </div>
        <figure className="portraitStage">
          <img className="heroPortrait" src={portraitUrl} alt={text.home.portraitAlt} />
        </figure>
        <span className="statusPill">{text.home.status}</span>
        <div className="portraitCaption"><strong>8e / 70 · Zindi</strong><span>{labels.heroProof}</span></div>
        <aside className="heroSignal" aria-label={text.home.domainsLabel}>
          <span>{labels.heroDomains}</span>
          <ul><li>{language === 'fr' ? 'Agents IA' : 'AI agents'}</li><li>Computer vision</li><li>{language === 'fr' ? 'Backends Python' : 'Python backends'}</li><li>{language === 'fr' ? 'Automatisation' : 'Automation'}</li></ul>
        </aside>
      </section>

      <section id="projects" className="section page">
        <div className="sectionHead"><div><p className="eyebrow">{labels.projectLabel}</p><h2>{labels.projectTitle}</h2></div><p>{labels.projectIntro}</p></div>
        <div className="projectGrid">
          {projects.map((project, index) => (
            <article className={`projectCard${index === 0 ? ' featured' : ''}`} key={project.slug}>
              <div className="cardTop"><span className="projectTag">{project[language].label}</span><span>{String(index + 1).padStart(2, '0')}{index === 0 ? ` / ${labels.featured}` : ''}</span></div>
              <h3>{project[language].title}</h3>
              <p className="projectSummary">{project[language].summary}</p>
              <dl className="projectMeta"><div><dt>{text.projectsSection.role}</dt><dd>{project[language].role}</dd></div><div><dt>{text.projectsSection.impact}</dt><dd>{project[language].result}</dd></div></dl>
              {project.stack.length > 0 && <div className="tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>}
              {project.slug in projectDetails && <details className="projectDetails"><summary>{labels.projectDetails} <span aria-hidden="true">＋</span></summary><p>{labels.capabilities}</p><ul>{projectDetails[project.slug as keyof typeof projectDetails][language].map((item) => <li key={item}>{item}</li>)}</ul>
              </details>}
              {project.href && <a className="caseLink" href={project.href} target="_blank" rel="noreferrer" onClick={() => trackLandingClick(project.slug, project[language].title, project.href!)}>{text.projectsSection.visit} ↗</a>}
            </article>
          ))}
        </div>
      </section>

      {showServices && <section id="services" className="section page">
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
      </section>}

      <section id="skills" className="section page">
        <div className="sectionHead"><div><p className="eyebrow">{labels.expertiseLabel}</p><h2>{labels.expertiseTitle}</h2></div><p>{labels.expertiseIntro}</p></div>
        <div className="skillsLayout">
          <div className="skillPanel">
            <div className="expertiseList">{domains.map((domain) => <article key={domain.title}><h3>{domain.title}</h3><p>{domain[language]}</p></article>)}</div>
            <div className="stackArea"><span className="eyebrow">{labels.stack}</span><div className="tags">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
          </div>
          <div id="experience" className="timelinePanel">
            <p className="eyebrow">{labels.experienceLabel}</p>
            <h2 className="timelineTitle">{labels.experienceTitle}</h2>
            <div className="timeline">{experiences.map((experience) => <article key={experience.frTitle || experience.title}><time>{language === 'fr' ? experience.frDate : experience.enDate}</time><div><h3>{language === 'fr' ? experience.frTitle || experience.title : experience.enTitle || experience.title}</h3><p>{experience[language]}</p></div></article>)}</div>
            <div id="credentials" className="credentials">
              <span className="eyebrow">{labels.credentials}</span>
              <div className="credentialList">
                {credentials.map(([source, label, href]) => (
                  <div className="credentialCard" key={label}>
                    <p><strong>{source}</strong> {label}</p>
                    <a href={href} target="_blank" rel="noreferrer" aria-label={`${source === 'Hugging Face' ? labels.viewProfile : labels.viewCertificate} : ${source} — ${label}`}>
                      {source === 'Hugging Face' ? labels.viewProfile : labels.viewCertificate} ↗
                    </a>
                  </div>
                ))}
                <Link className="cvLink" to="/cv">{labels.viewCv} ↗</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section page">
        <div className="contactGrid">
          <div className="contactPanel primaryContact">
            <div><p className="eyebrow">{labels.contactLabel}</p><h2>{labels.contactTitle}<br /><em>{labels.contactAccent}</em></h2><p className="contactText">{labels.contactText}</p></div>
            <div className="heroActions"><a className="button primary" href={contactHref}>{labels.email}</a><button className="button" type="button" onClick={copyEmail}>{labels.copyEmail}</button><Link className="textLink" to="/cv">{labels.viewCv} ↗</Link></div>
          </div>
          <aside className="contactPanel">
            <p className="eyebrow">{labels.contactDetails}</p>
            <div className="contactLinks"><a href={contactHref}>{email}</a><a href="tel:+2290191112696">+229 01 91 11 26 96</a><a href="https://github.com/Zelyanne" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/alexis-othily-273126212/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={huggingFaceHref} target="_blank" rel="noreferrer">Hugging Face ↗</a></div>
          </aside>
        </div>
      </section>
      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </main>
  )
}

const rootRoute = createRootRoute({ component: Layout })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => <HomePage showServices={false} /> })
const freelanceRoute = createRoute({ getParentRoute: () => rootRoute, path: 'freelance', component: () => <HomePage showServices /> })
const cvRoute = createRoute({ getParentRoute: () => rootRoute, path: 'cv', component: CvPage })
const countRoute = createRoute({ getParentRoute: () => rootRoute, path: 'count', component: CountPage })
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute, freelanceRoute, cvRoute, countRoute]), defaultPreload: 'intent' })

declare module '@tanstack/react-router' { interface Register { router: typeof router } }

createRoot(document.getElementById('root')!).render(<StrictMode><RouterProvider router={router} /></StrictMode>)
