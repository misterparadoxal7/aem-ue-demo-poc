const URN_PREFIX = 'urn:aem:'
const COMPONENT_RESOURCE_TYPES = {
  hero: 'ue-demo/components/hero',
  cardgrid: 'ue-demo/components/cardgrid',
  testimonial: 'ue-demo/components/testimonial',
  statsbar: 'ue-demo/components/statsbar',
  accordion: 'ue-demo/components/accordion',
  linklist: 'ue-demo/components/linklist',
  teaser: 'ue-demo/components/teaser',
  contactform: 'ue-demo/components/contactform',
  pricingtable: 'ue-demo/components/pricingtable',
  processsteps: 'ue-demo/components/processsteps',
  logocloud: 'ue-demo/components/logocloud',
  newslettersection: 'ue-demo/components/newslettersection',
  teamsection: 'ue-demo/components/teamsection',
  detailcontent: 'ue-demo/components/detailcontent',
  richtextsection: 'ue-demo/components/richtextsection',
  header: 'ue-demo/components/header',
  footer: 'ue-demo/components/footer',
  navbar: 'ue-demo/components/navbar',
}

export function getCqDataPath(resourcePath) {
  if (!resourcePath) return ''
  return resourcePath.replace(URN_PREFIX, '')
}

export function getResourceType(componentName) {
  return COMPONENT_RESOURCE_TYPES[componentName] || ''
}
