import Hero from '../components/Hero'
import CardGrid from '../components/CardGrid'
import Testimonial from '../components/Testimonial'
import StatsBar from '../components/StatsBar'
import InfoTooltip from '../components/InfoTooltip'
import LogoCloud from '../components/LogoCloud'
import NewsletterSection from '../components/NewsletterSection'
import Teaser from '../components/Teaser'
import useScrollReveal from '../hooks/useScrollReveal'
import { multiFieldToArray } from '../lib/contentService'

export default function HomePage({ content, resourcePath }) {
  const services = multiFieldToArray(content?.cardgrid, 'services', resourcePath + '/cardgrid')
  const stats = multiFieldToArray(content?.statsbar, 'stats', resourcePath + '/statsbar')
  const [ref, visible] = useScrollReveal()

  return (
    <>
      <Hero
        title={content?.hero?.title}
        subtitle={content?.hero?.subtitle}
        description={content?.hero?.description}
        ctaLabel={content?.hero?.ctaLabel}
        ctaUrl={content?.hero?.ctaUrl}
        bgImage={content?.hero?.bgImage}
        resourcePath={resourcePath + '/hero'}
        badge="Award-Winning Digital Agency"
        showParticles
      />

      <LogoCloud
        heading={content?.logocloud?.heading}
        resourcePath={resourcePath + '/logocloud'}
      />

      <CardGrid
        heading={content?.cardgrid?.heading}
        cards={services}
        resourcePath={resourcePath + '/cardgrid'}
        fieldName="servicesHeading"
      />

      <section className="section"
               data-aue-resource={resourcePath + '/whysection'}
               data-aue-type="container"
               data-aue-label="Why Nexus Digital"
               ref={ref}
               style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
        <div className="container">
          <div className="richtext-section" style={{ gap: '4rem', alignItems: 'flex-start' }}>
            <div className="richtext-content">
              <div className="section-divider" style={{ margin: '0 0 1.5rem' }} />
              <h2 data-aue-resource={resourcePath + '/whysection'}
                  data-aue-prop="heading"
                  data-aue-type="text"
                  data-aue-label="Why Nexus Heading">
                {content?.whysection?.heading || 'Why Nexus Digital?'}
              </h2>
              <div data-aue-resource={resourcePath + '/whysection'}
                   data-aue-prop="body"
                   data-aue-type="richtext"
                   data-aue-label="Why Nexus Body"
                   dangerouslySetInnerHTML={{ __html: content?.whysection?.body || '<p>We combine creative design with technical excellence to deliver digital experiences that drive measurable results. Our team of strategists, designers, and engineers work collaboratively to transform complex challenges into elegant solutions.</p><p>From startups to enterprise, we have helped hundreds of organizations establish and scale their digital presence with confidence.</p>' }} />
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', color: '#fff', fontWeight: 700,
                }}>✓</div>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-secondary), #9333ea)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', color: '#fff',
                }}>★</div>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent), #eab308)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', color: '#fff',
                }}>⚡</div>
              </div>
            </div>
            <div className="richtext-content">
              <div className="glass-light" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <InfoTooltip text={content?.infoTooltip} resourcePath={resourcePath} />
                </div>
                <h3 data-aue-resource={resourcePath + '/whysection'}
                    data-aue-prop="approachHeading"
                    data-aue-type="text"
                    data-aue-label="Approach Heading"
                    style={{ marginBottom: '0.75rem' }}>
                  {content?.whysection?.approachHeading || 'Our Approach'}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)', lineHeight: 1.8 }}
                   data-aue-resource={resourcePath + '/whysection'}
                   data-aue-prop="approachDescription"
                   data-aue-type="text"
                   data-aue-label="Approach Description">
                  {content?.whysection?.approachDescription || 'Every project begins with deep research and strategic thinking. We believe in data-driven design decisions and iterative development that puts your users first.'}
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '0.35rem 0.75rem', borderRadius: '50px',
                    background: '#eff6ff', color: 'var(--color-primary)',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}>Research</span>
                  <span style={{
                    padding: '0.35rem 0.75rem', borderRadius: '50px',
                    background: '#faf5ff', color: 'var(--color-secondary)',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}>Design</span>
                  <span style={{
                    padding: '0.35rem 0.75rem', borderRadius: '50px',
                    background: '#fefce8', color: '#a16207',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}>Develop</span>
                  <span style={{
                    padding: '0.35rem 0.75rem', borderRadius: '50px',
                    background: '#f0fdf4', color: '#15803d',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}>Deploy</span>
                </div>
              </div>
            </div>
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

      <StatsBar
        heading={content?.statsbar?.heading}
        stats={stats}
        resourcePath={resourcePath + '/statsbar'}
        dark
      />

      <Testimonial
        quote={content?.testimonial?.quote}
        author={content?.testimonial?.author}
        role={content?.testimonial?.role}
        avatar={content?.testimonial?.avatar}
        resourcePath={resourcePath + '/testimonial'}
      />

      <NewsletterSection resourcePath={resourcePath + '/newslettersection'} />
    </>
  )
}
