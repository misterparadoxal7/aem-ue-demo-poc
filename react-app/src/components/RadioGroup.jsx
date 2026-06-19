export default function RadioGroup({ label, name, options, resourcePath, fieldName }) {
  const optionsArray = Array.isArray(options) ? options : [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
  ]

  return (
    <div className="form-group"
         data-aue-resource={resourcePath}
         data-aue-type="container"
         data-aue-label="Radio Group">
      <label data-aue-prop={fieldName || 'formRadioLabel'}
             data-aue-type="text"
             data-aue-label="Radio Group Label">
        {label || 'Preferred Contact Method'}
      </label>
      <div className="radio-group">
        {optionsArray.map((opt, i) => (
          <label key={i} className="radio-option">
            <input type="radio" name={name || 'contactMethod'} value={opt.value || opt.label} />
            <span data-aue-resource={`${resourcePath}/formRadioOptions/item${i}`}
                  data-aue-prop="label"
                  data-aue-type="text"
                  data-aue-label={`Radio Option ${i + 1}`}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
