import useScrollReveal from '../hooks/useScrollReveal'
import { getCqDataPath, getResourceType } from '../lib/editorUtils'

const defaultLogos = [
  'TechVenture', 'CloudScale', 'DataPulse', 'GreenLeaf', 'ApexLogic', 'NorthStar'
]

export default function LogoCloud({ heading, logos, resourcePath }) {
  const [ref, visible] = useScrollReveal()
  const brandLogos = logos && logos.length ? logos : defaultLogos
  const hasContent = logos && logos.length

  return (
    <section className="section" ref={ref}
             style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
      <div className="container">
        {heading && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '2rem' }}
             data-aue-resource={resourcePath}
             data-aue-prop="heading"
             data-aue-type="text"
             data-aue-label="Logo Cloud Heading">
            {heading}
          </p>
        )}
        <div className="logo-cloud"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Logo Cloud"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('logocloud')}>
          {brandLogos.map((logo, i) => (
            <span key={i} className="logo-cloud-item"
                  {...(hasContent ? {
                    'data-aue-resource': `${resourcePath}/logos/item${i}`,
                    'data-aue-prop': 'name',
                    'data-aue-type': 'text'
                  } : {})}>
              {typeof logo === 'string' ? logo : logo.name || logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
