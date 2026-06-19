import { getCqDataPath, getResourceType } from '../lib/editorUtils'
import { useNavigate } from 'react-router-dom'

export default function Footer({ copyright, socialLinks, resourcePath, siteTitle }) {
  const navigate = useNavigate()
  return (
    <footer className="footer"
            data-aue-resource={resourcePath}
            data-aue-type="container"
            data-aue-label="Footer"
            data-cq-data-path={getCqDataPath(resourcePath)}
            data-cq-resource-type={getResourceType('footer')}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand"
               data-aue-resource={resourcePath}
               data-aue-type="container"
               data-aue-label="Footer Brand">
            <h3 data-aue-resource={resourcePath}
                data-aue-prop="footerBrandName"
                data-aue-type="text"
                data-aue-label="Footer Brand Name">
              {siteTitle || 'Nexus Digital'}
            </h3>
            <p data-aue-resource={resourcePath}
               data-aue-prop="footerBrandDescription"
               data-aue-type="text"
               data-aue-label="Footer Brand Description">
              We craft exceptional digital experiences that drive business growth and delight users across every touchpoint.
            </p>
          </div>
          <div className="footer-col"
               data-aue-resource={resourcePath}
               data-aue-type="container"
               data-aue-label="Quick Links">
            <h4 data-aue-resource={resourcePath}
                data-aue-prop="footerQuickLinksHeading"
                data-aue-type="text"
                data-aue-label="Quick Links Heading">
              Quick Links
            </h4>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerLinks/item0`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/')} onKeyDown={e => e.key === 'Enter' && navigate('/')}>Home</span>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerLinks/item1`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/about')} onKeyDown={e => e.key === 'Enter' && navigate('/about')}>About</span>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerLinks/item2`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/services')} onKeyDown={e => e.key === 'Enter' && navigate('/services')}>Services</span>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerLinks/item3`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/portfolio')} onKeyDown={e => e.key === 'Enter' && navigate('/portfolio')}>Portfolio</span>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerLinks/item4`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/contact')} onKeyDown={e => e.key === 'Enter' && navigate('/contact')}>Contact</span>
          </div>
          <div className="footer-col"
               data-aue-resource={resourcePath}
               data-aue-type="container"
               data-aue-label="Services Links">
            <h4 data-aue-resource={resourcePath}
                data-aue-prop="footerServicesHeading"
                data-aue-type="text"
                data-aue-label="Services Heading">
              Services
            </h4>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerServices/item0`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/services')} onKeyDown={e => e.key === 'Enter' && navigate('/services')}>Web Development</span>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerServices/item1`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/services')} onKeyDown={e => e.key === 'Enter' && navigate('/services')}>UX Design</span>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerServices/item2`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/services')} onKeyDown={e => e.key === 'Enter' && navigate('/services')}>Cloud Solutions</span>
            <span tabIndex={0} role="button" className="footer-nav-link"
                  data-aue-resource={`${resourcePath}/footerServices/item3`}
                  data-aue-prop="label" data-aue-type="text"
                  onClick={() => navigate('/services')} onKeyDown={e => e.key === 'Enter' && navigate('/services')}>Digital Strategy</span>
          </div>
          <div className="footer-col"
               data-aue-resource={resourcePath}
               data-aue-type="container"
               data-aue-label="Contact Info">
            <h4 data-aue-resource={resourcePath}
                data-aue-prop="footerContactHeading"
                data-aue-type="text"
                data-aue-label="Contact Heading">
              Contact
            </h4>
            <a href="mailto:hello@nexusdigital.com"
               data-aue-resource={resourcePath}
               data-aue-prop="footerEmail"
               data-aue-type="text"
               data-aue-label="Footer Email">hello@nexusdigital.com</a>
            <a href="tel:+1234567890"
               data-aue-resource={resourcePath}
               data-aue-prop="footerPhone"
               data-aue-type="text"
               data-aue-label="Footer Phone">+1 (234) 567-890</a>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}
               data-aue-resource={resourcePath}
               data-aue-prop="footerAddress"
               data-aue-type="text"
               data-aue-label="Footer Address">
              123 Innovation Drive<br />San Francisco, CA 94105
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright"
               data-aue-resource={resourcePath}
               data-aue-prop="footerCopyright"
               data-aue-type="text"
               data-aue-label="Copyright Text">
            {copyright || '© 2026 Nexus Digital. All rights reserved.'}
          </div>
          <div className="footer-socials"
               data-aue-resource={resourcePath}
               data-aue-type="container"
               data-aue-label="Social Links">
            <a href="#" aria-label="Twitter/X" title="Twitter/X"
               data-aue-resource={`${resourcePath}/footerSocials/item0`}
               data-aue-prop="label" data-aue-type="text">𝕏</a>
            <a href="#" aria-label="LinkedIn" title="LinkedIn"
               data-aue-resource={`${resourcePath}/footerSocials/item1`}
               data-aue-prop="label" data-aue-type="text">in</a>
            <a href="#" aria-label="GitHub" title="GitHub"
               data-aue-resource={`${resourcePath}/footerSocials/item2`}
               data-aue-prop="label" data-aue-type="text">GH</a>
            <a href="#" aria-label="Dribbble" title="Dribbble"
               data-aue-resource={`${resourcePath}/footerSocials/item3`}
               data-aue-prop="label" data-aue-type="text">Dr</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
