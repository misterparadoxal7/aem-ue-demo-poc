export default function CTAButton({ label, url, resourcePath, propName }) {
  return (
    <a href={url || '#'} className="btn btn-primary"
       data-aue-resource={resourcePath}
       data-aue-prop={propName || 'heroCtaLabel'}
       data-aue-type="text"
       data-aue-label="CTA Button">
      {label || 'Learn More'}
    </a>
  )
}
