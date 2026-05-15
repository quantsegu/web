import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader';

const pillars = [
  {
    number: 1,
    title: 'Dharma — Righteous Conduct',
    summary: 'Live with honesty, duty, and compassion in family, work, and community.',
    detail: 'Align daily choices with eternal principles: truth (satya), non-harm (ahimsa), and responsibility to society.',
  },
  {
    number: 2,
    title: 'Sadhana — Daily Spiritual Practice',
    summary: 'Morning prayer, meditation, and study keep the mind sattvic and focused.',
    detail: 'Even brief japa, pranayama, or scripture reading builds discipline that supports every other area of life.',
  },
  {
    number: 3,
    title: 'Sattvic Living',
    summary: 'Vegetarian, mindful food; moderation in speech and consumption.',
    detail: 'Prefer foods and habits that promote clarity—reducing tamasic influences strengthens body and character.',
  },
  {
    number: 4,
    title: 'Seva — Selfless Service',
    summary: 'Contribute time and resources to community, temple, and nation-building efforts.',
    detail: 'Service without expectation of reward is central to Sanātana Dharma and to a flourishing society.',
  },
  {
    number: 5,
    title: 'Parivar & Samaj',
    summary: 'Strengthen family bonds and cultural continuity across generations.',
    detail: 'Festivals, language, and shared values connect the diaspora to Bharat’s civilizational heritage.',
  },
  {
    number: 6,
    title: 'Continuous Learning',
    summary: 'Study śāstra, history, and contemporary guides to apply wisdom in modern life.',
    detail: 'Use structured resources—not scattered information—to deepen understanding and practice.',
  },
];

export default function SanatanDharmaLiving() {
  return (
    <section id="sanatan-dharma" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-bjp-navy/40 border-y border-saffron-500/20">
      <div className="tricolor-bar absolute top-0 left-0 right-0" />
      <div className="max-w-6xl mx-auto pt-4">
        <SectionHeader
          hindiTitle="सनातन धर्म — जीवन पद्धति"
          title="Sanātana Dharma Way of Living"
          subtitle="Six practical pillars for dharmic life—presented clearly, step by step, in the tradition of structured public guidance."
        />

        <div className="bjp-card divide-y divide-saffron-500/10">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              viewport={{ once: true, margin: '-80px' }}
              className="bjp-commitment-row flex-col sm:flex-row sm:items-start"
            >
              <motion.div className="bjp-pillar-number">{pillar.number}</motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-saffron-200 font-medium mt-1">{pillar.summary}</p>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{pillar.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="https://sanatanadharmaway.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Explore Sanātana Dharma Way
            <ExternalLink size={16} className="ml-2" />
          </a>
          <a
            href="https://brink-trick-47383861.figma.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-saffron-300 hover:text-white text-sm font-medium border border-saffron-500/40 px-6 py-3 rounded-md transition-colors"
          >
            Alpine Ashram Retreat
            <ExternalLink size={16} className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
