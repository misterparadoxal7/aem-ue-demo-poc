import useScrollReveal from '../hooks/useScrollReveal'
import { multiFieldToArray } from '../lib/contentService'
import { getCqDataPath, getResourceType } from '../lib/editorUtils'

const defaultTeam = [
  { name: 'Sarah Chen', role: 'CEO & Founder', bio: 'Visionary leader with 20+ years in digital transformation.' },
  { name: 'Marcus Johnson', role: 'CTO', bio: 'Architect of scalable cloud-native solutions.' },
  { name: 'Elena Rodriguez', role: 'Design Director', bio: 'Award-winning designer crafting meaningful experiences.' },
  { name: 'James Okonkwo', role: 'Head of Engineering', bio: 'Full-stack engineer leading high-performance teams.' },
]

export default function TeamSection({ heading, subtitle, teamMembers, resourcePath, useAEMData }) {
  const [ref, visible] = useScrollReveal()
  const members = useAEMData ? multiFieldToArray(useAEMData, 'teamMembers', resourcePath) : teamMembers || defaultTeam

  return (
    <section className="section section-alt"
             data-aue-resource={resourcePath}
             data-aue-type="container"
             data-aue-label="Team Section"
             data-cq-data-path={getCqDataPath(resourcePath)}
             data-cq-resource-type={getResourceType('teamsection')}>
      <div className="container">
        <div className="section-heading">
          <div className="section-divider" />
          <h2>{heading || 'Meet Our Team'}</h2>
          <p className="subtitle">{subtitle || 'Passionate people building exceptional digital experiences'}</p>
        </div>
        <div className={`team-grid ${visible ? 'visible' : ''}`} ref={ref}
             style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
          {members.map((member, i) => (
            <div key={i}
                 className="team-card"
                 data-aue-resource={useAEMData ? `${resourcePath}/teamMembers/item${i}` : undefined}
                 data-aue-type="container"
                 data-aue-label={`Team: ${member.name}`}
                 style={{ animationDelay: `${i * 0.1}s` }}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name}
                     className="team-avatar"
                     data-aue-prop="avatar" data-aue-type="image"
                     data-aue-label={`${member.name} Avatar`} />
              ) : (
                <div className="team-avatar-placeholder">
                  {member.name.charAt(0)}
                </div>
              )}
              <h3 data-aue-prop="name" data-aue-type="text" data-aue-label="Team Name">{member.name}</h3>
              <div className="team-role"
                   data-aue-prop="role" data-aue-type="text" data-aue-label="Team Role">{member.role}</div>
              <p className="team-bio"
                 data-aue-prop="bio" data-aue-type="text" data-aue-label="Team Bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
