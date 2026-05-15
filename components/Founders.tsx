import { useState } from 'react';
import { motion } from 'motion/react';
import { Linkedin, ExternalLink, Award } from 'lucide-react';

function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <motion.div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==" alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </motion.div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={() => setDidError(true)} />
  )
}

interface FounderAward {
  title: string;
  organization: string;
  year: string;
  description: string;
  images: { src: string; alt: string }[];
}

interface FounderCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  index: number;
  awards?: FounderAward[];
}

function FounderCard({ name, role, bio, image, linkedin, index, awards }: FounderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="w-full md:w-2/3 p-6">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          <p className="text-saffron-300 mb-4">{role}</p>
          <p className="text-gray-300 mb-4">{bio}</p>
          
          {linkedin && linkedin !== '#' && (
            <a 
              href={linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-saffron-300 hover:text-white transition-colors duration-200"
            >
              <Linkedin size={18} className="mr-2" />
              <span>Connect on LinkedIn</span>
            </a>
          )}

          {awards && awards.length > 0 && (
            <div className="mt-8 pt-6 border-t border-saffron-500/20">
              <div className="flex items-center mb-4">
                <Award className="text-saffron-400 mr-2" size={22} />
                <h4 className="text-lg font-bold text-white">Awards & Recognition</h4>
              </div>
              {awards.map((award) => (
                <div key={award.title} className="mb-6 last:mb-0">
                  <h5 className="text-white font-semibold">{award.title}</h5>
                  <p className="text-saffron-300 text-sm">{award.organization}</p>
                  <p className="text-gray-400 text-sm mb-2">{award.year}</p>
                  <p className="text-gray-300 text-sm mb-4">{award.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {award.images.map((img) => (
                      <div key={img.src} className="rounded-lg overflow-hidden ring-1 ring-saffron-500/20">
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Founders() {
  const founders = [
    {
      name: "Lakshmi Narayana Segu",
      role: "Founder & CEO",
      bio: "Lakshmi Narayana Segu is the founder of Shreshti, based in Switzerland (Wollerau). He is entrepreneur for various companies in India and Europe and has served as Enterprise Architect at APG Asset Management and Developer Advocate at IOMETE. His expertise spans enterprise architecture, data platform design & governance, data modeling, AI/ML, and digital transformation. He excelled in programs in Machine Learning at Stanford, an MBA at GITAM, and studies at the Indian Institute of Quantitative Finance.",
      image: "/founders/lakshmi-narayana-segu.jpg",
      linkedin: "https://www.linkedin.com/in/lakshmisegu/"
    },
    {
      name: "Lavanya Segu",
      role: "Co-Founder & COO · Founder, Balaji Foods",
      bio: "Lavanya brings extensive operational expertise to Shreshti and leads Balaji Foods across Europe. Her strategic vision and execution have been instrumental in establishing Shreshti's presence across Europe and Asia, delivering authentic Indian food to diaspora communities in 8+ countries.",
      image: "/founders/lavanya.jpg",
      linkedin: "#",
      awards: [
        {
          title: "Vasavi Women Award 2026",
          organization: "Vasavi Clubs International NRI District V601A",
          year: "Vasavi Jayanthi 2026 · Netherlands",
          description:
            "Recognised alongside Ashwini Babu (The Chutney Project) for leadership, community impact, and contributions to the Indian-Dutch diaspora. Nominations were supported by Vasavi Club Europe under the vision of Live to Serve.",
          images: [
            {
              src: "/awards/lavanya-vasavi-women-award-2026.png",
              alt: "Vasavi Women Award 2026 announcement featuring Lavanya Segu, Founder of Balaji Foods",
            },
            {
              src: "/awards/lavanya-vasavi-ceremony.png",
              alt: "Vasavi Clubs International award ceremony with Lavanya Segu and community leaders",
            },
          ],
        },
      ],
    }
  ];

  return (
    <section id="founders" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Founders</h2>
          <p className="text-saffron-100 max-w-2xl mx-auto">The visionary leaders behind Shreshti's global success</p>
          <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-bjp-green mx-auto mt-4"></div>
        </motion.div>
        
        <div className="space-y-8">
          {founders.map((founder, index) => (
            <FounderCard
              key={founder.name}
              name={founder.name}
              role={founder.role}
              bio={founder.bio}
              image={founder.image}
              linkedin={founder.linkedin}
              awards={founder.awards}
              index={index}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 bg-black/30 backdrop-blur-md rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Join Our Team</h3>
          <p className="text-gray-300 mb-6">
            We're always looking for talented individuals who share our vision and values. 
            If you're passionate about innovation and making a global impact, we'd love to hear from you.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center bg-gradient-to-r from-saffron-500 to-bjp-green text-white font-medium py-2 px-6 rounded-lg hover:from-saffron-600 hover:to-bjp-green-dark transition-all duration-300"
          >
            Get in Touch
            <ExternalLink size={16} className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
