import { useState } from 'react'
import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import useScrollReveal from '../hooks/useScrollReveal'

export default function NewsletterSection({ heading, subtitle, placeholder, buttonText, resourcePath }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [ref, visible] = useScrollReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  if (subscribed) {
    return (
      <section className="section section-gradient" ref={ref}
               style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>You're subscribed!</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>Thanks for joining. We'll send you the latest updates and insights.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section section-gradient" ref={ref}
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Newsletter"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('newslettersection')}
             style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
      <div className="container">
        <div className="newsletter">
          <h3 data-aue-resource={resourcePath}
              data-aue-prop="heading"
              data-aue-type="text"
              data-aue-label="Newsletter Heading">
            {heading || 'Stay in the Loop'}
          </h3>
          <p data-aue-resource={resourcePath}
             data-aue-prop="subtitle"
             data-aue-type="text"
             data-aue-label="Newsletter Subtitle">
            {subtitle || 'Get the latest insights, trends, and updates delivered to your inbox.'}
          </p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                   placeholder={placeholder || 'Enter your email'}
                   data-aue-resource={resourcePath}
                   data-aue-prop="placeholder"
                   data-aue-type="text"
                   required />
            <button type="submit" className="btn btn-primary"
                    data-aue-resource={resourcePath}
                    data-aue-prop="buttonText"
                    data-aue-type="text"
                    data-aue-label="Newsletter Button">
              {buttonText || 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
