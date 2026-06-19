import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function Header({ siteTitle, navLinks, resourcePath }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)

  const defaultLinks = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Services', url: '/services' },
    { label: 'Portfolio', url: '/portfolio' },
    { label: 'Contact', url: '/contact' },
  ]

  const links = navLinks && typeof navLinks === 'object' && !Array.isArray(navLinks)
    ? Object.values(navLinks).filter(v => v && v.label)
    : (Array.isArray(navLinks) ? navLinks : defaultLinks)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header"
            data-aue-resource={resourcePath}
            data-aue-type="container"
            data-aue-label="Header"
            data-cq-data-path={getCqDataPath(resourcePath)}
            data-cq-resource-type={getResourceType('header')}>
      <div className="header-inner">
        <span className="header-logo"
              tabIndex={0} role="button"
              onClick={() => navigate('/')}
              onKeyDown={e => e.key === 'Enter' && navigate('/')}
              data-aue-resource={resourcePath}
              data-aue-prop="siteTitle"
              data-aue-type="text"
              data-aue-label="Site Title">
          {siteTitle || 'Nexus Digital'}
        </span>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu">
          <span /><span /><span />
        </button>
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {links.map((link, i) => {
            const isActive = location.pathname === (link.url || '/')
            const isCTA = link.label?.toLowerCase().includes('contact') ||
                          link.label?.toLowerCase().includes('start') ||
                          link.label?.toLowerCase().includes('touch')
            return (
              <span
                key={i}
                tabIndex={0} role="button"
                className={`nav-link ${isActive ? 'nav-active' : ''} ${isCTA ? 'header-cta' : ''}`}
                onClick={() => { navigate(link.url || '/'); closeMenu() }}
                onKeyDown={e => e.key === 'Enter' && (navigate(link.url || '/'), closeMenu())}
                data-aue-resource={`${resourcePath}/navLinks/item${i}`}
                data-aue-prop="label"
                data-aue-type="text"
                data-aue-label={`Nav: ${link.label}`}
              >
                {link.label}
              </span>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
