export default function ImageWithCaption({ src, caption, resourcePath, propPrefix }) {
  return (
    <figure className="image-caption"
            data-aue-resource={resourcePath}
            data-aue-type="container"
            data-aue-label="Image with Caption">
      <img src={src} alt={caption || ''}
           data-aue-resource={resourcePath}
           data-aue-prop={propPrefix ? `${propPrefix}Image` : 'detailImage'}
           data-aue-type="image"
           data-aue-label="Image" />
      {caption && (
        <figcaption data-aue-resource={resourcePath}
                    data-aue-prop={propPrefix ? `${propPrefix}Caption` : 'detailTitle'}
                    data-aue-type="text"
                    data-aue-label="Caption">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
