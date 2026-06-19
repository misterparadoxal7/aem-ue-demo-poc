import { MapTo } from '@adobe/aem-react-editable-components'
import Hero from './components/Hero'
import Card from './components/Card'
import CardGrid from './components/CardGrid'
import Testimonial from './components/Testimonial'
import StatsBar from './components/StatsBar'
import Accordion from './components/Accordion'
import LinkList from './components/LinkList'
import Teaser from './components/Teaser'
import ContactForm from './components/ContactForm'
import PricingTable from './components/PricingTable'
import ProcessSteps from './components/ProcessSteps'
import LogoCloud from './components/LogoCloud'
import NewsletterSection from './components/NewsletterSection'
import TeamSection from './components/TeamSection'
import DetailContent from './components/DetailContent'
import RichTextSection from './components/RichTextSection'

MapTo('ue-demo/components/hero')(Hero)
MapTo('ue-demo/components/card')(Card)
MapTo('ue-demo/components/cardgrid')(CardGrid)
MapTo('ue-demo/components/testimonial')(Testimonial)
MapTo('ue-demo/components/statsbar')(StatsBar)
MapTo('ue-demo/components/accordion')(Accordion)
MapTo('ue-demo/components/linklist')(LinkList)
MapTo('ue-demo/components/teaser')(Teaser)
MapTo('ue-demo/components/contactform')(ContactForm)
MapTo('ue-demo/components/pricingtable')(PricingTable)
MapTo('ue-demo/components/processsteps')(ProcessSteps)
MapTo('ue-demo/components/logocloud')(LogoCloud)
MapTo('ue-demo/components/newslettersection')(NewsletterSection)
MapTo('ue-demo/components/teamsection')(TeamSection)
MapTo('ue-demo/components/detailcontent')(DetailContent)
MapTo('ue-demo/components/richtextsection')(RichTextSection)
