import { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Linkedin, Mail, Globe, Briefcase, Award, GraduationCap, Users } from 'lucide-react';

function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==" alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={() => setDidError(true)} />
  )
}

interface ExperienceCardProps {
  company: string;
  position: string;
  period: string;
  description: string;
  index: number;
}

function ExperienceCard({ company, position, period, description, index }: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pl-8 pb-8 border-l border-saffron-800"
    >
      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-saffron-500 to-bjp-green"></div>
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg">{position}</h3>
        <div className="flex justify-between items-center mb-3">
          <p className="text-saffron-300">{company}</p>
          <p className="text-gray-400 text-sm">{period}</p>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Profile() {
  const profileData = {
    name: "Lakshmi Narayana Segu",
    title: "Entrepreneur & Enterprise Architect",
    image: "/founders/lakshmi-narayana-segu.jpg",
    bio: "Lakshmi Narayana Segu is the founder of Shreshti, based in the Netherlands (Hoofddorp). He is Director at Ecosphere Trade Private Limited and has served as Enterprise Architect at APG Asset Management and Developer Advocate / Product Owner at IOMETE. His expertise spans enterprise architecture, data platform design & governance, data modeling, AI/ML, and digital transformation.",
    detailedBio: "Lakshmi combines deep experience in enterprise technology with a focus on data platforms, AI/ML, and stakeholder-led digital transformation. As Director at Ecosphere Trade and former Enterprise Architect at APG Asset Management, he has driven data governance, platform design, and strategic technology initiatives. His work at IOMETE as Developer Advocate and Product Owner further reflects his commitment to data and AI innovation. He is currently pursuing a Program in Machine Learning at Stanford University, an MBA at GITAM School of International Business, and studies at the Indian Institute of Quantitative Finance.",
    experience: [
      {
        company: "Ecosphere Trade Private Limited",
        position: "Director",
        period: "Jun 2021 - Present",
        description: "Director of the company, leading strategic initiatives and operations. Ecosphere Trade is based in Andhra Pradesh, India."
      },
      {
        company: "APG Asset Management",
        position: "Enterprise Architect",
        period: "Feb 2021 - Mar 2025",
        description: "Led enterprise architecture, data platform design and governance, and technology strategy for the asset management organization."
      },
      {
        company: "IOMETE",
        position: "Developer Advocate / Product Owner",
        period: "Sep 2022 - Dec 2023",
        description: "Drove developer advocacy and product ownership for data and analytics solutions, engaging with technical communities and shaping product direction."
      },
      {
        company: "Shreshti",
        position: "Founder & CEO",
        period: "Present",
        description: "Founder of Shreshti, with a diverse portfolio of subsidiaries and joint ventures across Europe, Asia, and Africa in food distribution, financial services, AI, and data management."
      }
    ],
    education: [
      {
        degree: "Program in Machine Learning",
        institution: "Stanford University",
        year: "Expected Dec 2025"
      },
      {
        degree: "MBA",
        institution: "GITAM School of International Business",
        year: "Expected Dec 2025"
      },
      {
        degree: "Quantitative Finance",
        institution: "Indian Institute of Quantitative Finance",
        year: "Expected Dec 2025"
      }
    ],
    skills: [
      "Enterprise Architecture", "Data Platform Design & Governance", "Data Modeling",
      "AI / Machine Learning", "Stakeholder Engagement", "Digital Transformation",
      "Strategic Leadership", "Product Ownership", "Developer Advocacy"
    ],
    awards: [
      {
        title: "Entrepreneur of the Year",
        organization: "European Business Association",
        year: "2020"
      },
      {
        title: "Innovation Leader Award",
        organization: "Global FinTech Alliance",
        year: "2018"
      },
      {
        title: "Business Excellence Recognition",
        organization: "Dutch Chamber of Commerce",
        year: "2017"
      }
    ],
    contact: {
      email: "lakshmi@shreshti.nl",
      linkedin: "https://www.linkedin.com/in/lakshmisegu"
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050108]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/3"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-saffron-500 to-bjp-green opacity-75 blur"></div>
                <div className="relative overflow-hidden rounded-2xl">
                  <ImageWithFallback
                    src={profileData.image}
                    alt={profileData.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <div className="mt-8 bg-black/40 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-white font-bold text-xl mb-4">Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="text-saffron-400 mr-4" size={20} />
                    <a href={`mailto:${profileData.contact.email}`} className="text-gray-300 hover:text-saffron-300 transition-colors">
                      {profileData.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="text-saffron-400 mr-4" size={20} />
                    <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors">
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Globe className="text-saffron-400 mr-4" size={20} />
                    <a href="/" className="text-gray-300 hover:text-saffron-300 transition-colors">
                      Shreshti Website
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-2/3"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{profileData.name}</h1>
              <p className="text-saffron-300 text-xl mb-6">{profileData.title}</p>
              
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-gray-300 mb-6">{profileData.bio}</p>
                <p className="text-gray-300 whitespace-pre-line">{profileData.detailedBio}</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-8">
                <div className="flex items-center mb-4">
                  <Award className="text-saffron-400 mr-3" size={24} />
                  <h2 className="text-2xl font-bold text-white">Awards & Recognition</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {profileData.awards.map((award, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="bg-saffron-950/40 p-4 rounded-lg"
                    >
                      <h3 className="text-white font-semibold">{award.title}</h3>
                      <p className="text-saffron-300 text-sm">{award.organization}</p>
                      <p className="text-gray-400 text-sm">{award.year}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <GraduationCap className="text-saffron-400 mr-3" size={24} />
                  <h2 className="text-2xl font-bold text-white">Education</h2>
                </div>
                <div className="space-y-4">
                  {profileData.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="border-l-2 border-saffron-700 pl-4"
                    >
                      <h3 className="text-white font-semibold">{edu.degree}</h3>
                      <p className="text-saffron-300">{edu.institution}</p>
                      <p className="text-gray-400 text-sm">{edu.year}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-10">
            <Briefcase className="text-saffron-400 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-white">Professional Experience</h2>
          </div>
          
          <div className="mt-10">
            {profileData.experience.map((exp, index) => (
              <ExperienceCard
                key={index}
                company={exp.company}
                position={exp.position}
                period={exp.period}
                description={exp.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-10">
            <Users className="text-saffron-400 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-white">Expertise & Skills</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {profileData.skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-gradient-to-r from-saffron-900/70 to-bjp-green/40 px-4 py-2 rounded-full text-white"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}