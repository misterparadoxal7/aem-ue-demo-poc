import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function RichTextSection({ heading, body, image, resourcePath, reverse,
  propHeading = 'heroTitle', propBody = 'heroDescription', propImage = 'heroBgImage' }) {
  return (
    <section className="section"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Rich Text Section"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('richtextsection')}>
      <div className={`container richtext-section ${reverse ? 'richtext-section-reverse' : ''}`}>
        <div className="richtext-content">
          <h2 data-aue-resource={resourcePath}
              data-aue-prop={propHeading}
              data-aue-type="text"
              data-aue-label="Section Heading">
            {heading || ''}
          </h2>
          {body && (
            <div data-aue-resource={resourcePath}
                 data-aue-prop={propBody}
                 data-aue-type="richtext"
                 data-aue-label="Section Body"
                 dangerouslySetInnerHTML={{ __html: body }} />
          )}
        </div>
        {image && (
          <img src={image} alt={heading || ''} className="richtext-image"
               data-aue-resource={resourcePath}
               data-aue-prop={propImage}
               data-aue-type="image"
               data-aue-label="Section Image" />
        )}
      </div>
    </section>
  )
}
