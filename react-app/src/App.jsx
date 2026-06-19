import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import PortfolioDetailPage from './pages/PortfolioDetailPage'
import ContactPage from './pages/ContactPage'
import BackToTop from './components/BackToTop'
import { usePageContent } from './lib/contentService'

function Layout({ children, content, resourcePath }) {
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('aue:content-change'))
    }, 100)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      <Header
        siteTitle={content?.siteTitle}
        navLinks={content?.navLinks}
        resourcePath={resourcePath}
      />
      <main className="main-content">
        {children}
      </main>
      <Footer
        copyright={content?.footerCopyright}
        siteTitle={content?.siteTitle}
        resourcePath={resourcePath}
      />
      <BackToTop />
    </>
  )
}

export default function App() {
  const { content, loading, error, resourcePath } = usePageContent()

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p style={{ color: 'var(--color-text-light)' }}>Loading Nexus Digital...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <h1>Error Loading Page</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <Layout content={content} resourcePath={resourcePath}>
      <Routes>
        <Route path="/" element={
          <HomePage content={content} resourcePath={resourcePath} />
        } />
        <Route path="/about" element={
          <AboutPage content={content} resourcePath={resourcePath} />
        } />
        <Route path="/services" element={
          <ServicesPage content={content} resourcePath={resourcePath} />
        } />
        <Route path="/portfolio" element={
          <PortfolioPage content={content} resourcePath={resourcePath} />
        } />
        <Route path="/portfolio/:slug" element={
          <PortfolioDetailPage content={content} resourcePath={resourcePath} />
        } />
        <Route path="/contact" element={
          <ContactPage content={content} resourcePath={resourcePath} />
        } />
      </Routes>
    </Layout>
  )
}
