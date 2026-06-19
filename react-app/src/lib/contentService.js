import { useState, useEffect } from 'react'

export function usePageContent() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resourcePath, setResourcePath] = useState('')

  useEffect(() => {
    async function fetchContent() {
      try {
        let jsonUrl
        let resourcePath

        const URN_PREFIX = 'urn:aem:'

        if (import.meta.env.DEV) {
          jsonUrl = '/content/ue-demo/en/home/jcr:content.infinity.json'
          resourcePath = `${URN_PREFIX}/content/ue-demo/en/home/jcr:content`
        } else {
          const path = window.location.pathname.replace(/\.html$/, '')
          jsonUrl = `${path}/jcr:content.infinity.json`
          resourcePath = `${URN_PREFIX}${path}/jcr:content`
        }

        let resp
        try {
          resp = await fetch(jsonUrl)
        } catch (fetchErr) {
          resp = null
        }

        if (resp && resp.ok) {
          const page = await resp.json()
          setContent(page)
          setResourcePath(resourcePath)
        } else {
          console.warn('AEM not available, loading mock content...')
          const mockResp = await fetch('/mock-content.json')
          const mockData = await mockResp.json()
          setContent(mockData)
          setResourcePath('urn:mock:/content/ue-demo/en/home/jcr:content')
        }
      } catch (err) {
        console.error('Content fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return { content, loading, error, resourcePath }
}

export function multiFieldToArray(parentData, fieldName, parentResourcePath) {
  const field = parentData?.[fieldName]
  if (!field || typeof field !== 'object') return []

  return Object.entries(field)
    .filter(([key]) => /^item\d+$/.test(key) || key.startsWith('item'))
    .map(([key, value]) => ({
      ...value,
      _path: `${parentResourcePath}/${fieldName}/${key}`
    }))
}
