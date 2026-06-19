import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import useScrollReveal from '../hooks/useScrollReveal'

const defaultSteps = [
  { number: '01', title: 'Discovery', desc: 'We dive deep into your business, goals, and audience to define the scope.' },
  { number: '02', title: 'Design', desc: 'Our team creates wireframes and high-fidelity mockups for your approval.' },
  { number: '03', title: 'Develop', desc: 'We build your solution using modern, scalable technology stacks.' },
  { number: '04', title: 'Deploy', desc: 'We launch, monitor, and ensure everything runs smoothly in production.' },
]

export default function ProcessSteps({ heading, subtitle, steps, resourcePath }) {
  const [ref, visible] = useScrollReveal()
  const processSteps = steps && steps.length ? steps : defaultSteps

  return (
    <section className="section-alt"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Process Steps"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('processsteps')}>
      <div className="container">
        <div className="section-heading">
          <div className="section-divider" />
          <h2 data-aue-resource={resourcePath}
              data-aue-prop="heading"
              data-aue-type="text"
              data-aue-label="Process Heading">
            {heading || 'How We Work'}
          </h2>
          <p className="subtitle"
             data-aue-resource={resourcePath}
             data-aue-prop="subtitle"
             data-aue-type="text"
             data-aue-label="Process Subtitle">
            {subtitle || 'A proven process that delivers results, every time'}
          </p>
        </div>
        <div className="process-steps" ref={ref}
             style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
          {processSteps.map((step, i) => (
            <div key={i} className="process-step"
                 data-aue-resource={resourcePath ? `${resourcePath}/process/item${i}` : undefined}
                 data-aue-type="container"
                 data-aue-label={`Step: ${step.title}`}>
              <div className="process-step-number"
                   data-aue-prop="number" data-aue-type="text">{step.number}</div>
              <h3 data-aue-prop="title" data-aue-type="text">{step.title}</h3>
              <p data-aue-prop="description" data-aue-type="text">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
