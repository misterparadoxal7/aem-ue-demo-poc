export default function InfoTooltip({ text, resourcePath }) {
  if (!text) return null

  return (
    <div className="info-tooltip"
         data-aue-resource={resourcePath}
         data-aue-type="container"
         data-aue-label="Info Tooltip">
      <span className="info-icon">i</span>
      <span className="tooltip-box"
            data-aue-prop="infoTooltip"
            data-aue-type="text"
            data-aue-label="Tooltip Text">
        {text}
      </span>
    </div>
  )
}
