import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function Testimonial({ quote, author, role, avatar, resourcePath }) {
  if (!quote) return null

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="testimonial"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Testimonial"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('testimonial')}>
          <div className="testimonial-quote"
               data-aue-resource={resourcePath}
               data-aue-prop="quote"
               data-aue-type="richtext"
               data-aue-label="Testimonial Quote"
               dangerouslySetInnerHTML={{ __html: quote }} />
          {(author || role || avatar) && (
            <div className="testimonial-author">
              {avatar && (
                <img src={avatar} alt={author || ''} className="testimonial-avatar"
                     data-aue-resource={resourcePath}
                     data-aue-prop="avatar"
                     data-aue-type="image"
                     data-aue-label="Author Avatar" />
              )}
              <div>
                <div className="testimonial-name"
                     data-aue-resource={resourcePath}
                     data-aue-prop="author"
                     data-aue-type="text"
                     data-aue-label="Author Name">
                  {author || ''}
                </div>
                {role && (
                  <div className="testimonial-role"
                       data-aue-resource={resourcePath}
                       data-aue-prop="role"
                       data-aue-type="text"
                       data-aue-label="Author Role">
                    {role}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
