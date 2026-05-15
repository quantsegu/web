import { motion } from 'motion/react';

interface SectionHeaderProps {
  id?: string;
  title: string;
  subtitle?: string;
  hindiTitle?: string;
}

export default function SectionHeader({ title, subtitle, hindiTitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="text-center mb-12 sm:mb-16"
    >
      {hindiTitle && (
        <p className="text-saffron-400 text-sm font-semibold tracking-widest uppercase mb-2">
          {hindiTitle}
        </p>
      )}
      <h2 className="section-heading">{title}</h2>
      {subtitle && <p className="section-subtitle mt-3">{subtitle}</p>}
      <motion.div className="section-divider" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }} />
    </motion.div>
  );
}
