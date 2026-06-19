import { useState } from 'react'
import Hero from '../components/Hero'
import CTAButton from '../components/CTAButton'
import Teaser from '../components/Teaser'
import NewsletterSection from '../components/NewsletterSection'
import { multiFieldToArray } from '../lib/contentService'
import { useNavigate } from 'react-router-dom'

const categories = ['All', 'Web App', 'Mobile', 'Design', 'Cloud']

export default function PortfolioPage({ content, resourcePath }) {
  const navigate = useNavigate()
  const projects = multiFieldToArray(content?.cardgrid, 'services', resourcePath + '/cardgrid')
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => (p.category || 'Web App').toLowerCase() === activeFilter.toLowerCase())

  return (
    <>
      <Hero
        title={content?.hero?.title || 'Our Work'}
        subtitle={content?.hero?.subtitle || 'Projects we are proud of'}
        bgImage={content?.hero?.bgImage}
        resourcePath={resourcePath + '/hero'}
        compact
        badge="Portfolio"
      />

      <section className="section"
               data-aue-resource={resourcePath + '/cardgrid'}
               data-aue-type="container"
               data-aue-label="Portfolio Grid">
        <div className="container">
          <div className="section-heading">
            <div className="section-divider" />
            <h2 data-aue-resource={resourcePath + '/cardgrid'}
                data-aue-prop="portfolioHeading"
                data-aue-type="text"
                data-aue-label="Portfolio Heading">
              {content?.cardgrid?.heading || 'Featured Projects'}
            </h2>
            <p className="subtitle"
               data-aue-resource={resourcePath + '/cardgrid'}
               data-aue-prop="portfolioSubtitle"
               data-aue-type="text"
               data-aue-label="Portfolio Subtitle">
              {content?.cardgrid?.subtitle || 'Browse our latest work across industries and disciplines'}
            </p>
          </div>

          <div className="filter-bar">
            {categories.map(cat => (
              <button key={cat}
                      className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                      onClick={() => setActiveFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="card-grid">
            {filtered.map((project, i) => (
              <article key={i} className="card" style={{ cursor: 'pointer' }}
                       onClick={() => navigate(`/portfolio/project-${i + 1}`)}
                       data-aue-resource={project._path || `${resourcePath}/cardgrid/services/item${i}`}
                       data-aue-type="container"
                       data-aue-label={`Project: ${project.title || ''}`}>
                {project.image && (
                  <div className="card-image-wrapper">
                    <img src={project.image} alt={project.title} className="card-image"
                         data-aue-prop="image" data-aue-type="image" data-aue-label="Project Image" />
                    <div className="card-image-overlay" />
                    <span className="card-badge">{project.category || 'Web App'}</span>
                  </div>
                )}
                <div className="card-body">
                  <h3 data-aue-prop="title" data-aue-type="text" data-aue-label="Project Title">
                    {project.title}
                  </h3>
                  <p data-aue-prop="description" data-aue-type="text" data-aue-label="Project Description">
                    {project.description}
                  </p>
                  <span className="card-cta">View Case Study →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Teaser
        image={content?.teaser?.image}
        title={content?.teaser?.title}
        description={content?.teaser?.description}
        ctaLabel={content?.teaser?.ctaLabel}
        ctaUrl={content?.teaser?.ctaUrl}
        resourcePath={resourcePath + '/teaser'}
      />

      <section className="section section-alt" style={{ textAlign: 'center' }}
               data-aue-resource={resourcePath + '/ctasection'}
               data-aue-type="container"
               data-aue-label="CTA Section">
        <div className="container">
          <div className="section-heading">
            <h2 data-aue-resource={resourcePath + '/ctasection'}
                data-aue-prop="ctaHeading"
                data-aue-type="text"
                data-aue-label="CTA Heading">
              {content?.ctasection?.heading || 'Ready to Start Your Project?'}
            </h2>
            <p className="subtitle"
               data-aue-resource={resourcePath + '/ctasection'}
               data-aue-prop="ctaSubtitle"
               data-aue-type="text"
               data-aue-label="CTA Subtitle">
              {content?.ctasection?.subtitle || "Let's build something remarkable together"}
            </p>
          </div>
          <CTAButton
            label={content?.ctasection?.ctaLabel || "Let's Build Something Together"}
            url="/contact"
            resourcePath={resourcePath + '/ctasection'}
            propName="ctaLabel"
          />
        </div>
      </section>

      <NewsletterSection resourcePath={resourcePath + '/newslettersection'} />
    </>
  )
}
