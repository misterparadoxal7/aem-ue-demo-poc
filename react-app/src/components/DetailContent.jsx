import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import LinkList from './LinkList'
import { multiFieldToArray } from '../lib/contentService'

export default function DetailContent({ content, resourcePath }) {
  const relatedLinks = multiFieldToArray(content, 'detailLinks', resourcePath)

  return (
    <section className="section">
      <div className="container">
        <div className="detail-content"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Detail Content"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('detailcontent')}>
          <h1 data-aue-prop="detailTitle"
              data-aue-type="text"
              data-aue-label="Detail Title">
            {content?.detailTitle || 'Project Detail'}
          </h1>
          {content?.detailImage && (
            <img src={content.detailImage} alt={content.detailTitle || ''}
                 data-aue-prop="detailImage"
                 data-aue-type="image"
                 data-aue-label="Detail Image" />
          )}
          {content?.detailBody && (
            <div className="detail-body"
                 data-aue-prop="detailBody"
                 data-aue-type="richtext"
                 data-aue-label="Detail Body"
                 dangerouslySetInnerHTML={{ __html: content.detailBody }} />
          )}
          {relatedLinks.length > 0 && (
            <div className="detail-links">
              <LinkList
                heading="Related Links"
                links={relatedLinks}
                resourcePath={resourcePath}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
