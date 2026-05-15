import { motion } from 'motion/react';
import { ExternalLink, ChevronRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

const commitments = [
  {
    title: 'National Development & Self-Reliance',
    points: [
      'Support policies that strengthen infrastructure, innovation, and economic opportunity for all citizens.',
      'Encourage enterprise and technology that build an Atmanirbhar ecosystem at home and abroad.',
    ],
  },
  {
    title: 'Cultural Roots & Sanātana Heritage',
    points: [
      'Preserve and promote India’s civilizational knowledge—yoga, Ayurveda, languages, and sacred traditions.',
      'Connect diaspora communities to authentic dharmic learning, not diluted cultural copies.',
    ],
  },
  {
    title: 'Transparent, Structured Information',
    points: [
      'Present goals as clear numbered commitments—what we stand for, what we do, and how to participate.',
      'Make resources easy to find: pillars, FAQs, and direct links to trusted partners and programmes.',
    ],
  },
  {
    title: 'Seva, Security & Good Governance',
    points: [
      'Value disciplined institutions, community service, and accountable leadership in business and society.',
      'Stand with initiatives that protect citizens, celebrate festivals openly, and unite rather than divide.',
    ],
  },
];

const quickFacts = [
  { label: 'Party', value: 'Bharatiya Janata Party (BJP)' },
  { label: 'Ideals', value: 'Antyodaya, cultural nationalism, integral humanism' },
  { label: 'Our stance', value: 'Aligned supporter — development with dharmic values' },
];

export default function BJPInformation() {
  return (
    <section id="bjp-support" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          hindiTitle="भारतीय जनता पार्टी — सूचना पद्धति"
          title="Support for BJP & National Vision"
          subtitle="We present information the BJP way: clear headings, numbered commitments, and direct access to official resources—so every visitor knows where we stand."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {quickFacts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bjp-card p-5 text-center border-t-4 border-t-saffron-500"
            >
              <p className="text-saffron-400 text-xs font-bold uppercase tracking-wider">{fact.label}</p>
              <p className="text-white font-semibold mt-2">{fact.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bjp-card">
          <div className="bg-gradient-to-r from-saffron-600 to-bjp-green px-6 py-4">
            <h3 className="text-white font-bold text-lg">Sankalp — Our Commitments</h3>
            <p className="text-white/90 text-sm mt-1">Structured priorities in line with BJP public communication</p>
          </div>
          <div className="divide-y divide-saffron-500/15">
            {commitments.map((block, index) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="bjp-pillar-number text-sm w-8 h-8">{index + 1}</span>
                  <h4 className="text-white font-bold text-lg pt-0.5">{block.title}</h4>
                </div>
                <ul className="ml-11 space-y-2">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                      <ChevronRight className="text-saffron-500 shrink-0 mt-0.5" size={16} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-4 max-w-xl mx-auto">
            Shreshti supports the BJP’s mission of a strong, prosperous Bharat rooted in Sanātana values. For official party news, manifestos, and membership, visit the source below.
          </p>
          <a
            href="https://www.bjp.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Official BJP Website
            <ExternalLink size={18} className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
