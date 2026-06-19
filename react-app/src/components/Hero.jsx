import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function Hero({
  title, subtitle, description, ctaLabel, ctaUrl,
  bgImage, resourcePath, compact, badge, showParticles, children, secondCtaLabel, secondCtaUrl,
  propTitle = 'title', propSubtitle = 'subtitle', propDescription = 'description',
  propCtaLabel = 'ctaLabel', propImage = 'bgImage', propSecondCtaLabel = 'secondCtaLabel'
}) {
  const style = bgImage ? { backgroundImage: `url(${bgImage})` } : {}

  return (
    <section className={`hero ${compact ? 'hero-compact' : ''}`}
             style={style}
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Hero"
             data-aue-filter="ue-demo/hero"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('hero')}>
      {bgImage && (
        <img src={bgImage} alt=""
             style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
             data-aue-resource={resourcePath}
             data-aue-prop={propImage}
             data-aue-type="image"
             data-aue-label="Hero Background Image" />
      )}
      {showParticles && (
        <div className="hero-particles">
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
        </div>
      )}
      <div className="hero-overlay" />
      <div className="hero-content container">
        {badge && <span className="hero-badge">{badge}</span>}
        <h1 className="hero-title"
            data-aue-resource={resourcePath}
            data-aue-prop={propTitle}
            data-aue-type="text"
            data-aue-label="Hero Title">
          {title || 'Your Headline Here'}
        </h1>
        <p className="hero-subtitle"
           data-aue-resource={resourcePath}
           data-aue-prop={propSubtitle}
           data-aue-type="text"
           data-aue-label="Hero Subtitle">
          {subtitle || ''}
        </p>
        {description && (
          <div className="hero-description"
               data-aue-resource={resourcePath}
               data-aue-prop={propDescription}
               data-aue-type="richtext"
               data-aue-label="Hero Description"
               dangerouslySetInnerHTML={{ __html: description }} />
        )}
        <div className="hero-actions">
          {ctaLabel && (
            <a href={ctaUrl || '#contact'} className="btn btn-primary"
               data-aue-resource={resourcePath}
               data-aue-prop={propCtaLabel}
               data-aue-type="text"
               data-aue-label="CTA Button">
              {ctaLabel}
            </a>
          )}
          {secondCtaLabel && (
            <a href={secondCtaUrl || '#learn-more'} className="btn btn-secondary"
               data-aue-resource={resourcePath}
               data-aue-prop={propSecondCtaLabel}
               data-aue-type="text"
               data-aue-label="Secondary CTA">
              {secondCtaLabel}
            </a>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
