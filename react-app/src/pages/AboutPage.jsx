import Hero from '../components/Hero'
import RichTextSection from '../components/RichTextSection'
import StatsBar from '../components/StatsBar'
import Accordion from '../components/Accordion'
import TeamSection from '../components/TeamSection'
import Teaser from '../components/Teaser'
import NewsletterSection from '../components/NewsletterSection'
import useScrollReveal from '../hooks/useScrollReveal'
import { multiFieldToArray } from '../lib/contentService'

const defaultMissionItems = [
  { icon: '🎯', title: 'Purpose-Driven', desc: 'Every project starts with understanding your core mission and goals.' },
  { icon: '🤝', title: 'Collaborative', desc: 'We partner closely with your team, ensuring alignment at every stage.' },
  { icon: '🔬', title: 'Data-Informed', desc: 'Design and development decisions are backed by research and analytics.' },
  { icon: '🚀', title: 'Results-Focused', desc: 'We measure success by the tangible impact delivered to your business.' },
]

export default function AboutPage({ content, resourcePath }) {
  const stats = multiFieldToArray(content?.statsbar, 'stats', resourcePath + '/statsbar')
  const accordionItems = multiFieldToArray(content?.accordion, 'accordionItems', resourcePath + '/accordion')
  const missionItems = multiFieldToArray(content?.missionsection, 'missionItems', resourcePath + '/missionsection')
  const [ref, visible] = useScrollReveal()

  return (
    <>
      <Hero
        title={content?.hero?.title}
        subtitle={content?.hero?.subtitle}
        description={content?.hero?.description}
        bgImage={content?.hero?.bgImage}
        resourcePath={resourcePath + '/hero'}
        compact
        badge="About Us"
      />

      <RichTextSection
        heading={content?.story?.heading || 'Our Story'}
        body={content?.story?.body}
        image={content?.story?.image}
        resourcePath={resourcePath + '/story'}
      />

      <section className="section"
               data-aue-resource={resourcePath + '/missionsection'}
               data-aue-type="container"
               data-aue-label="Mission & Values"
               ref={ref}
               style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
        <div className="container">
          <div className="section-heading">
            <div className="section-divider" />
            <h2 data-aue-resource={resourcePath + '/missionsection'}
                data-aue-prop="heading"
                data-aue-type="text"
                data-aue-label="Mission Heading">
              {content?.missionsection?.heading || 'Our Mission & Values'}
            </h2>
            <p className="subtitle"
               data-aue-resource={resourcePath + '/missionsection'}
               data-aue-prop="subtitle"
               data-aue-type="text"
               data-aue-label="Mission Subtitle">
              {content?.missionsection?.subtitle || 'We believe in building technology that makes a real difference'}
            </p>
          </div>
          <div className="card-grid card-grid-4">
            {(missionItems.length > 0 ? missionItems : defaultMissionItems).map((item, i) => (
              <div key={i} className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', cursor: 'default' }}
                   data-aue-resource={`${resourcePath}/missionsection/missionItems/item${i}`}
                   data-aue-type="container"
                   data-aue-label={`Mission: ${item.title || ''}`}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon || ''}</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}
                    data-aue-prop="title" data-aue-type="text">{item.title || ''}</h3>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', lineHeight: 1.7 }}
                   data-aue-prop="description" data-aue-type="text">{item.desc || ''}</p>
              </div>
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

      <TeamSection
        heading={content?.teamsection?.heading || 'Leadership Team'}
        subtitle={content?.teamsection?.subtitle || 'Meet the people driving digital innovation at Nexus Digital'}
        resourcePath={resourcePath + '/teamsection'}
        useAEMData={content?.teamsection}
      />

      <StatsBar
        heading={content?.statsbar?.heading}
        stats={stats}
        resourcePath={resourcePath + '/statsbar'}
        dark
      />

      <Accordion
        heading={content?.accordion?.heading}
        items={accordionItems}
        resourcePath={resourcePath + '/accordion'}
      />

      <NewsletterSection resourcePath={resourcePath + '/newslettersection'} />
    </>
  )
}
