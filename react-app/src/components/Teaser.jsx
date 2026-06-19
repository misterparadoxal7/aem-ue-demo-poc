import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import useScrollReveal from '../hooks/useScrollReveal'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80'

export default function Teaser({ image, title, description, ctaLabel, ctaUrl, resourcePath }) {
  const [ref, visible] = useScrollReveal()
  const bgImage = image || DEFAULT_IMAGE

  return (
    <section className="section"
             ref={ref}
             style={{
               backgroundImage: `url(${bgImage})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed',
               position: 'relative',
               padding: '7rem 0',
               opacity: visible ? 1 : 0,
               transition: 'opacity 0.7s ease',
             }}
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Teaser"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('teaser')}>
      {image && (
        <img src={image} alt=""
             style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
             data-aue-resource={resourcePath}
             data-aue-prop="image"
             data-aue-type="image"
             data-aue-label="Teaser Background Image" />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(2,6,23,0.85) 0%, rgba(30,41,59,0.65) 50%, rgba(37,99,235,0.35) 100%)',
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          fontWeight: 900, color: '#fff',
          marginBottom: '1rem', lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
            data-aue-resource={resourcePath}
            data-aue-prop="title"
            data-aue-type="text"
            data-aue-label="Teaser Title">
          {title}
        </h2>
        <p style={{
          fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)',
          maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.7,
        }}
           data-aue-resource={resourcePath}
           data-aue-prop="description"
           data-aue-type="text"
           data-aue-label="Teaser Description">
          {description}
        </p>
        {ctaLabel && (
          <a href={ctaUrl || '/contact'} className="btn btn-primary"
             style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}
             data-aue-resource={resourcePath}
             data-aue-prop="ctaLabel"
             data-aue-type="text"
             data-aue-label="Teaser CTA">
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}
