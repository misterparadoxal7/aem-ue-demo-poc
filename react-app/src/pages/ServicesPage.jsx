import Hero from '../components/Hero'
import CardGrid from '../components/CardGrid'
import Testimonial from '../components/Testimonial'
import LinkList from '../components/LinkList'
import PricingTable from '../components/PricingTable'
import ProcessSteps from '../components/ProcessSteps'
import Teaser from '../components/Teaser'
import NewsletterSection from '../components/NewsletterSection'
import { multiFieldToArray } from '../lib/contentService'

export default function ServicesPage({ content, resourcePath }) {
  const services = multiFieldToArray(content?.cardgrid, 'services', resourcePath + '/cardgrid')
  const links = multiFieldToArray(content?.linklist, 'links', resourcePath + '/linklist')

  return (
    <>
      <Hero
        title={content?.hero?.title}
        subtitle={content?.hero?.subtitle}
        description={content?.hero?.description}
        bgImage={content?.hero?.bgImage}
        resourcePath={resourcePath + '/hero'}
        compact
        badge="What We Do"
        ctaLabel={content?.hero?.ctaLabel || 'View Plans'}
        ctaUrl="#pricing"
      />

      <CardGrid
        heading={content?.cardgrid?.heading}
        cards={services}
        resourcePath={resourcePath + '/cardgrid'}
      />

      <ProcessSteps
        heading={content?.processsteps?.heading}
        subtitle={content?.processsteps?.subtitle}
        resourcePath={resourcePath + '/processsteps'}
      />

      <PricingTable
        heading={content?.pricingtable?.heading}
        subtitle={content?.pricingtable?.subtitle}
        resourcePath={resourcePath + '/pricingtable'}
      />

      <Teaser
        image={content?.teaser?.image}
        title={content?.teaser?.title}
        description={content?.teaser?.description}
        ctaLabel={content?.teaser?.ctaLabel}
        ctaUrl={content?.teaser?.ctaUrl}
        resourcePath={resourcePath + '/teaser'}
      />

      <Testimonial
        quote={content?.testimonial?.quote}
        author={content?.testimonial?.author}
        role={content?.testimonial?.role}
        avatar={content?.testimonial?.avatar}
        resourcePath={resourcePath + '/testimonial'}
      />

      <section className="section section-alt"
               data-aue-resource={resourcePath + '/linklist'}
               data-aue-type="container"
               data-aue-label="Related Resources">
        <div className="container">
          <div className="section-heading">
            <div className="section-divider" />
            <h2 data-aue-resource={resourcePath + '/linklist'}
                data-aue-prop="relatedHeading"
                data-aue-type="text"
                data-aue-label="Related Resources Heading">
              {content?.relatedHeading || 'Related Resources'}
            </h2>
            <p className="subtitle"
               data-aue-resource={resourcePath + '/linklist'}
               data-aue-prop="relatedSubtitle"
               data-aue-type="text"
               data-aue-label="Related Resources Subtitle">
              {content?.relatedSubtitle || 'Explore helpful guides and documentation'}
            </p>
          </div>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <LinkList
              heading={content?.linklist?.heading}
              links={links}
              resourcePath={resourcePath + '/linklist'}
            />
          </div>
        </div>
      </section>

      <NewsletterSection resourcePath={resourcePath + '/newslettersection'} />
    </>
  )
}
