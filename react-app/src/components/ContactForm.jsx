import { useState } from 'react'
import RadioGroup from './RadioGroup'
import InfoTooltip from './InfoTooltip'
import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import { multiFieldToArray } from '../lib/contentService'

export default function ContactForm({ heading, nameLabel, namePlaceholder, emailLabel, emailPlaceholder, subjectLabel, subjectOptions = [], messageLabel, messagePlaceholder, checkboxLabel, radioLabel, radioOptions = [], submitLabel, infoTooltip, resourcePath }) {
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <section className="section section-alt" data-aue-resource={resourcePath}
             data-aue-type="container" data-aue-label="Contact Form Section"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('contactform')}>
      <div className="container">
        <div className="contact-form-wrapper">
          <h2 data-aue-resource={resourcePath}
              data-aue-prop="heading"
              data-aue-type="text"
              data-aue-label="Form Heading">
            {heading || 'Get in Touch'}
          </h2>

          <InfoTooltip text={infoTooltip} resourcePath={resourcePath} />

          {submitted ? (
            <div className="testimonial" style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '1.25rem' }}>Thank you! Your message has been sent. We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label data-aue-resource={resourcePath}
                       data-aue-prop="nameLabel"
                       data-aue-type="text"
                       data-aue-label="Name Label">
                  {nameLabel || 'Full Name'}
                </label>
                <input type="text"
                       placeholder={namePlaceholder || 'Enter your name'}
                       data-aue-resource={resourcePath}
                       data-aue-prop="namePlaceholder"
                       data-aue-type="text"
                       data-aue-label="Name Placeholder" />
              </div>

              <div className="form-group">
                <label data-aue-resource={resourcePath}
                       data-aue-prop="emailLabel"
                       data-aue-type="text"
                       data-aue-label="Email Label">
                  {emailLabel || 'Email Address'}
                </label>
                <input type="email"
                       placeholder={emailPlaceholder || 'Enter your email'}
                       data-aue-resource={resourcePath}
                       data-aue-prop="emailPlaceholder"
                       data-aue-type="text"
                       data-aue-label="Email Placeholder" />
              </div>

              <div className="form-group">
                <label data-aue-resource={resourcePath}
                       data-aue-prop="subjectLabel"
                       data-aue-type="text"
                       data-aue-label="Subject Label">
                  {subjectLabel || 'Subject'}
                </label>
                <select data-aue-resource={resourcePath}
                        data-aue-prop="subjectLabel"
                        data-aue-type="text"
                        data-aue-label="Subject Select">
                  {subjectOptions.length > 0 ? subjectOptions.map((opt, i) => (
                    <option key={i} value={opt.value}
                            data-aue-resource={`${resourcePath}/subjectOptions/item${i}`}
                            data-aue-prop="label"
                            data-aue-type="text"
                            data-aue-label={`Subject Option ${i + 1}`}>
                      {opt.label}
                    </option>
                  )) : (
                    <>
                      <option>General Inquiry</option>
                      <option>Project Proposal</option>
                      <option>Partnership</option>
                      <option>Support</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label data-aue-resource={resourcePath}
                       data-aue-prop="messageLabel"
                       data-aue-type="text"
                       data-aue-label="Message Label">
                  {messageLabel || 'Message'}
                </label>
                <textarea
                  placeholder={messagePlaceholder || 'Tell us about your project...'}
                  data-aue-resource={resourcePath}
                  data-aue-prop="messagePlaceholder"
                  data-aue-type="text"
                  data-aue-label="Message Placeholder" />
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" id="newsletter" />
                <label htmlFor="newsletter"
                       data-aue-resource={resourcePath}
                       data-aue-prop="checkboxLabel"
                       data-aue-type="text"
                       data-aue-label="Checkbox Label">
                  {checkboxLabel || 'Subscribe to our newsletter'}
                </label>
              </div>

              <RadioGroup
                label={radioLabel}
                name="contactMethod"
                options={radioOptions}
        resourcePath={resourcePath}
        fieldName="radioLabel"
              />

              <div className="form-submit"
                   data-aue-resource={resourcePath}
                   data-aue-type="container"
                   data-aue-label="Submit Button">
                <button type="submit" className="btn btn-primary"
                        data-aue-prop="submitLabel"
                        data-aue-type="text"
                        data-aue-label="Submit Label">
                  {submitLabel || 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {toast && <div className="toast"
                      data-aue-resource={resourcePath}
                      data-aue-prop="successMessage"
                      data-aue-type="text"
                      data-aue-label="Success Message">Message sent successfully!</div>}
    </section>
  )
}
