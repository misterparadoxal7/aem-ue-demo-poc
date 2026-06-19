import { useState, useEffect, useRef } from 'react'
import { getCqDataPath, getResourceType } from '../lib/editorUtils'

export default function StatsBar({ heading, stats, resourcePath, dark }) {
  const statsArray = Array.isArray(stats) ? stats : [
    { value: '500+', label: 'Clients' },
    { value: '50M+', label: 'Users Reached' },
    { value: '98%', label: 'Satisfaction' },
    { value: '15+', label: 'Years Experience' },
  ]

  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState(statsArray.map(() => 0))
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setAnimated(true); obs.unobserve(el) }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!animated) return
    const duration = 1500
    const intervals = statsArray.map((stat, i) => {
      const num = parseInt(stat.value.replace(/[^0-9]/g, ''))
      if (!num) return null
      const step = Math.max(1, Math.floor(num / 30))
      const intervalId = setInterval(() => {
        setCounts(prev => {
          const next = [...prev]
          const current = next[i] + step
          next[i] = current >= num ? num : current
          return next
        })
      }, duration / 30)
      setTimeout(() => clearInterval(intervalId), duration)
      return intervalId
    })
    return () => intervals.forEach(id => id && clearInterval(id))
  }, [animated, statsArray])

  const formatCount = (stat, count) => {
    const suffix = stat.value.replace(/[0-9]/g, '')
    return count > 0 ? `${count}${suffix}` : stat.value
  }

  return (
    <section className={`section ${dark ? 'section-dark' : 'section-alt'}`} ref={ref}
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Stats Bar"
             data-aue-filter="ue-demo/statsbar"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('statsbar')}>
      <div className="container">
        {heading && (
          <div className="section-heading">
            <h2 data-aue-resource={resourcePath}
                data-aue-prop="heading"
                data-aue-type="text"
                data-aue-label="Stats Heading">
              {heading}
            </h2>
          </div>
        )}
        <div className={`stats-bar ${dark ? 'stats-bar-white' : ''}`}>
          {statsArray.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value"
                   data-aue-resource={`${resourcePath}/stats/item${i}`}
                   data-aue-prop="value"
                   data-aue-type="text"
                   data-aue-label={`Stat ${i + 1} Value`}>
                {animated ? formatCount(stat, counts[i]) : stat.value}
              </div>
              <div className="stat-label"
                   data-aue-resource={`${resourcePath}/stats/item${i}`}
                   data-aue-prop="label"
                   data-aue-type="text"
                   data-aue-label={`Stat ${i + 1} Label`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
