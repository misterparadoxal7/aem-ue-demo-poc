import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function Card({ title, description, image, ctaLabel, ctaUrl, resourcePath, badge }) {
  return (
    <article className="card"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label={`Card: ${title || ''}`}
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('card')}>
      {image && (
        <div className="card-image-wrapper">
          <img src={image} alt={title || ''} className="card-image"
               data-aue-resource={resourcePath}
               data-aue-prop="image"
               data-aue-type="image"
               data-aue-label="Card Image" />
          <div className="card-image-overlay" />
          {badge && <span className="card-badge">{badge}</span>}
        </div>
      )}
      <div className="card-body">
        <h3 data-aue-resource={resourcePath}
            data-aue-prop="title"
            data-aue-type="text"
            data-aue-label="Card Title">
          {title || ''}
        </h3>
        <p data-aue-resource={resourcePath}
           data-aue-prop="description"
           data-aue-type="text"
           data-aue-label="Card Description">
          {description || ''}
        </p>
        {ctaLabel && (
          <a href={ctaUrl || '#'} className="card-cta"
             data-aue-resource={resourcePath}
             data-aue-prop="ctaLabel"
             data-aue-type="text"
             data-aue-label="Card CTA">
            {ctaLabel} →
          </a>
        )}
      </div>
    </article>
  )
}
