import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function LinkList({ heading, links, resourcePath }) {
  const linksArray = Array.isArray(links) ? links : [
    { label: 'Case Studies', url: '#' },
    { label: 'Documentation', url: '#' },
    { label: 'Blog', url: '#' },
  ]

  return (
    <div className="link-list"
         data-aue-resource={resourcePath}
         data-aue-type="container"
         data-aue-label="Link List"
         data-cq-data-path={getCqDataPath(resourcePath)}
         data-cq-resource-type={getResourceType('linklist')}>
      {heading && (
        <h3 data-aue-resource={resourcePath}
            data-aue-prop="heading"
            data-aue-type="text"
            data-aue-label="Link List Heading">
          {heading}
        </h3>
      )}
      <div className="link-list-items">
        {linksArray.map((link, i) => (
          <a key={i} href={link.url || '#'} className="link-item"
             data-aue-resource={`${resourcePath}/links/item${i}`}
             data-aue-prop="label"
             data-aue-type="text"
             data-aue-label={`Link: ${link.label || ''}`}>
            {link.label || ''}
          </a>
        ))}
      </div>
    </div>
  )
}
