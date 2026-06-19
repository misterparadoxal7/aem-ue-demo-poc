import Hero from '../components/Hero'
import ContactForm from '../components/ContactForm'
import NewsletterSection from '../components/NewsletterSection'
import { multiFieldToArray } from '../lib/contentService'

export default function ContactPage({ content, resourcePath }) {
  const subjectOptions = multiFieldToArray(content?.contactform, 'subjectOptions', resourcePath + '/contactform')
  const radioOptions = multiFieldToArray(content?.contactform, 'radioOptions', resourcePath + '/contactform')

  return (
    <>
      <Hero
        title={content?.hero?.title || 'Get in Touch'}
        subtitle={content?.hero?.subtitle || 'We would love to hear from you'}
        bgImage={content?.hero?.bgImage}
        resourcePath={resourcePath + '/hero'}
        compact
        badge="Contact Us"
        description={content?.hero?.description || "Have a project in mind? Let's talk about how we can help bring your vision to life."}
      />
      <ContactForm
        heading={content?.contactform?.heading}
        nameLabel={content?.contactform?.formNameLabel}
        namePlaceholder={content?.contactform?.formNamePlaceholder}
        emailLabel={content?.contactform?.formEmailLabel}
        emailPlaceholder={content?.contactform?.formEmailPlaceholder}
        subjectLabel={content?.contactform?.formSubjectLabel}
        subjectOptions={subjectOptions}
        messageLabel={content?.contactform?.formMessageLabel}
        messagePlaceholder={content?.contactform?.formMessagePlaceholder}
        checkboxLabel={content?.contactform?.formCheckboxLabel}
        radioLabel={content?.contactform?.formRadioLabel}
        radioOptions={radioOptions}
        submitLabel={content?.contactform?.formSubmitLabel}
        infoTooltip={content?.contactform?.infoTooltip}
        resourcePath={resourcePath + '/contactform'}
      />
      <NewsletterSection resourcePath={resourcePath + '/newslettersection'} />
    </>
  )
}
