import { useState } from 'react'
import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function Accordion({ heading, items, resourcePath }) {
  const [openIndex, setOpenIndex] = useState(null)

  const itemsArray = Array.isArray(items) ? items : [
    { title: 'What services do you offer?', content: '<p>We offer a full range of digital services including UX design, web development, cloud architecture, and digital strategy.</p>' },
    { title: 'How long does a typical project take?', content: '<p>Project timelines vary depending on scope. Most projects range from 8-16 weeks from discovery to launch.</p>' },
    { title: 'What is your pricing model?', content: '<p>We work on a project-based pricing model. Contact us for a customized quote based on your specific requirements.</p>' },
  ]

  return (
    <section className="section">
      <div className="container">
        <div className="accordion-section"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Accordion"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('accordion')}>
          {heading && (
            <h2 data-aue-resource={resourcePath}
                data-aue-prop="heading"
                data-aue-type="text"
                data-aue-label="Accordion Heading">
              {heading}
            </h2>
          )}
          {itemsArray.map((item, i) => (
            <div key={i}
                 className={`accordion-item ${openIndex === i ? 'open' : ''}`}
                 data-aue-resource={`${resourcePath}/accordionItems/item${i}`}
                 data-aue-type="container"
                 data-aue-label={`FAQ: ${item.title || ''}`}>
              <button className="accordion-trigger"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      data-aue-prop="title"
                      data-aue-type="text"
                      data-aue-label="FAQ Title">
                {item.title || ''}
              </button>
              <div className="accordion-panel">
                {item.content && (
                  <div data-aue-prop="content"
                       data-aue-type="richtext"
                       data-aue-label="FAQ Content"
                       dangerouslySetInnerHTML={{ __html: item.content }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
