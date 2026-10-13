import { motion } from 'motion/react';
import SectionHeader from './SectionHeader';

const pillars = [
  {
    hindi: 'सेवा',
    name: 'Seva',
    meaning: 'Selfless Service',
    body: 'Enterprise with a higher duty (Dharma). Every venture within our ecosystem—from financial cooperatives to community platforms—is designed to serve communities with integrity, transparency, and care.',
    accent: 'border-t-brand-gold from-brand-gold/10',
  },
  {
    hindi: 'संस्कृति',
    name: 'Sanskriti',
    meaning: 'Cultural Continuity & Values',
    body: 'Rooted in Sanātana principles, we honor the wisdom of tradition, ethical stewardship, and non-harm (Ahimsa). We preserve cultural identity while building scalable modern systems.',
    accent: 'border-t-brand-saffron from-brand-saffron/10',
  },
  {
    hindi: 'विकास',
    name: 'Vikas',
    meaning: 'Sustainable Growth & Creation',
    body: 'Real progress is holistic. Through cutting-edge software architecture, sustainable agricultural networks, and value-driven enterprises, we forge a path of continuous, sustainable, and shared prosperity.',
    accent: 'border-t-brand-emerald from-brand-emerald/25',
  },
];

export default function BrandStory() {
  return (
    <section id="story" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader hindiTitle="सृष्टि" title="The Tapestry of Purpose" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-80px' }}
          className="bjp-card p-6 sm:p-10"
        >
          <p className="text-xl sm:text-2xl font-medium text-white leading-relaxed">
            In an interconnected global landscape, enterprise is more than the accumulation of
            capital—it is a conscious act of creation.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 text-gray-300 leading-relaxed">
            <p>
              The word <span className="text-brand-gold font-semibold">Shreshti</span> (derived
              from Srishti, meaning creation and cosmic order, as well as Shreshtha, denoting
              noble excellence) reflects our foundational belief: commercial vitality and
              civilizational values are not opposing forces, but complementary pillars of a
              thriving society.
            </p>
            <p>
              Born at the intersection of East and West, spanning Europe and Asia, Shreshti
              serves as a stewardship ecosystem connecting technology, food security, wealth
              creation, and community roots.
            </p>
          </div>
        </motion.div>

        <div className="text-center mt-14 mb-8">
          <p className="text-saffron-400 text-sm font-semibold tracking-widest uppercase mb-2">
            सेवा · संस्कृति · विकास
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Our Three Pillars</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: '-60px' }}
              className={`bjp-card border-t-4 bg-gradient-to-b to-transparent p-6 ${pillar.accent}`}
            >
              <p className="text-saffron-300 text-lg font-semibold">{pillar.hindi}</p>
              <h4 className="text-2xl font-bold text-white uppercase tracking-wide mt-1">
                {pillar.name}
              </h4>
              <p className="text-brand-gold text-sm font-medium mt-1">{pillar.meaning}</p>
              <p className="text-gray-300 text-sm leading-relaxed mt-4">{pillar.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
