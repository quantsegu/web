import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

interface Collaboration {
  name: string;
  logo: string;
  description: string;
  url: string;
}

function CollaborationCard({ name, logo, description, url, index }: Collaboration & { index: number }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="group bg-black/40 backdrop-blur-md rounded-xl overflow-hidden block hover:ring-1 hover:ring-purple-500/50 transition-all duration-300"
    >
      <div className="p-6 h-full flex flex-col">
        <motion.div
          className="flex items-center mb-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            {logo}
          </div>
          <h3 className="text-xl font-bold text-white ml-4 group-hover:text-purple-200 transition-colors">
            {name}
          </h3>
        </motion.div>

        <p className="text-purple-100 mb-4 flex-1">{description}</p>

        <span className="inline-flex items-center text-sm font-medium text-purple-300 group-hover:text-purple-100 transition-colors">
          Visit website
          <ExternalLink size={16} className="ml-2" />
        </span>
      </div>
    </motion.a>
  );
}

export default function Collaborations() {
  const collaborations: Collaboration[] = [
    {
      name: 'Quantamix Solutions',
      logo: 'QS',
      description:
        'Technology and solutions partner helping organizations modernize operations with data, AI, and enterprise platforms.',
      url: 'https://quantamixsolutions.com/',
    },
    {
      name: 'Sanātana Dharma Way',
      logo: 'SD',
      description:
        'An interactive learning guide to Sanātana Dharma—connecting tradition, practice, and daily life through structured knowledge regions.',
      url: 'https://sanatanadharmaway.eu/',
    },
    {
      name: 'KensoFI',
      logo: 'KF',
      description:
        'AI-powered loan automation for financial institutions—instant decisions, fraud detection, and intelligent lending infrastructure.',
      url: 'https://kensofi.com/',
    },
    {
      name: 'Lekhly',
      logo: 'LK',
      description:
        'Creative and content partner supporting storytelling, publishing, and digital experiences across our ecosystem.',
      url: 'https://www.lekhly.com/',
    },
  ];

  return (
    <section id="collaborations" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Collaborations</h2>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Trusted partners we work with across technology, finance, culture, and content
          </p>
          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collaborations.map((partner, index) => (
            <CollaborationCard key={partner.url} {...partner} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
