import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import useScrollReveal from '../hooks/useScrollReveal'

const defaultPlans = [
  {
    name: 'Starter', price: '$2,500', duration: '/month',
    desc: 'Perfect for small businesses getting started with digital.',
    features: ['Up to 5 pages', 'Responsive design', 'Basic SEO', 'Contact form', '1 revision cycle'],
    featured: false, popular: false, cta: 'Get Started',
  },
  {
    name: 'Growth', price: '$5,000', duration: '/month',
    desc: 'For growing businesses that need a stronger digital presence.',
    features: ['Up to 15 pages', 'Custom design system', 'Advanced SEO', 'Blog integration', 'Analytics setup', 'Priority support'],
    featured: true, popular: 'Most Popular', cta: 'Start Growing',
  },
  {
    name: 'Enterprise', price: 'Custom', duration: '',
    desc: 'Tailored solutions for large-scale digital operations.',
    features: ['Unlimited pages', 'Custom web application', 'API integrations', 'Dedicated team', '24/7 support', 'SLA guarantee'],
    featured: false, popular: false, cta: 'Contact Us',
  },
]

export default function PricingTable({ heading, subtitle, plans, resourcePath }) {
  const [ref, visible] = useScrollReveal()
  const pricingPlans = plans && plans.length ? plans : defaultPlans

  return (
    <section className="section"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Pricing Table"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('pricingtable')}>
      <div className="container">
        <div className="section-heading">
          <div className="section-divider" />
          <h2 data-aue-resource={resourcePath}
              data-aue-prop="heading"
              data-aue-type="text"
              data-aue-label="Pricing Heading">
            {heading || 'Simple Pricing'}
          </h2>
          <p className="subtitle"
             data-aue-resource={resourcePath}
             data-aue-prop="subtitle"
             data-aue-type="text"
             data-aue-label="Pricing Subtitle">
            {subtitle || 'Transparent pricing designed to scale with your business'}
          </p>
        </div>
        <div className="pricing-grid" ref={ref}
             style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          {pricingPlans.map((plan, i) => (
            <div key={i}
                 className={`pricing-card ${plan.featured ? 'featured' : ''}`}
                 data-aue-resource={resourcePath ? `${resourcePath}/pricing/item${i}` : undefined}
                 data-aue-type="container"
                 data-aue-label={`Plan: ${plan.name}`}>
              {plan.popular && <span className="pricing-popular">{plan.popular}</span>}
              <h3 className="pricing-name"
                  data-aue-prop="name" data-aue-type="text">{plan.name}</h3>
              <div className="pricing-price"
                   data-aue-prop="price" data-aue-type="text">{plan.price}</div>
              {plan.duration && <div className="pricing-duration">{plan.duration}</div>}
              <p className="pricing-desc"
                 data-aue-prop="description" data-aue-type="text">{plan.desc}</p>
              <ul className="pricing-features">
                {plan.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              <a href={plan.ctaUrl || '/contact'} className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`}>
                {plan.cta || 'Learn More'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
