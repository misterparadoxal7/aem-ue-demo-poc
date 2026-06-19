import Hero from '../components/Hero'
import DetailContent from '../components/DetailContent'
import { useParams } from 'react-router-dom'

export default function PortfolioDetailPage({ content, resourcePath }) {
  const { slug } = useParams()

  return (
    <>
      <Hero
        title={content?.detailTitle || `Project: ${slug || ''}`}
        subtitle={content?.detailSubtitle || 'Project case study and details'}
        bgImage={content?.detailImage || content?.heroBgImage}
        resourcePath={resourcePath}
        compact
        propTitle="detailTitle"
        propSubtitle="detailSubtitle"
        propImage="detailImage"
      />
      <DetailContent content={content} resourcePath={resourcePath} />
    </>
  )
}
