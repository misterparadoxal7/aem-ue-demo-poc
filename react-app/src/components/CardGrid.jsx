import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import Card from './Card'

export default function CardGrid({
  heading, subtitle, cards, resourcePath, fieldName
}) {
  const cardArray = Array.isArray(cards) ? cards : []

  return (
    <section className="section"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Card Grid"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('cardgrid')}>
      <div className="container">
        {(heading || subtitle) && (
          <div className="section-heading">
            <h2 data-aue-resource={resourcePath}
                data-aue-prop={fieldName || 'heading'}
                data-aue-type="text"
                data-aue-label="Section Heading">
              {heading || ''}
            </h2>
            {subtitle && <p className="subtitle"
                            data-aue-resource={resourcePath}
                            data-aue-prop={fieldName ? fieldName + 'Subtitle' : 'subtitle'}
                            data-aue-type="text"
                            data-aue-label="Section Subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="card-grid">
          {cardArray.map((card, i) => (
            <Card key={i}
                  title={card.title}
                  description={card.description}
                  image={card.image}
                  ctaLabel={card.ctaLabel}
                  ctaUrl={card.ctaUrl}
                  resourcePath={card._path || `${resourcePath}/services/item${i}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
