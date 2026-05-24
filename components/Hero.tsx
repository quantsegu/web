import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="tricolor-bar absolute top-16 left-0 right-0 z-20" />
      <div className="text-center z-10 max-w-4xl">
        <motion.p
          className="text-saffron-400 text-sm font-bold tracking-widest uppercase mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          सेवा · संस्कृति · विकास
        </motion.p>
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Shreshti
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl text-saffron-100 mb-4 max-w-3xl mx-auto font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Enterprise with Sanātana values — food, finance, technology, and community across Europe and Asia
        </motion.p>
        <motion.p
          className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          Established in the Netherlands. We build and support businesses with clear priorities,
          transparent communication, and dharmic purpose.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#sanatan-dharma" className="btn-primary">
            Sanātana Dharma Living
          </a>
          <Link
            to="/software"
            className="inline-flex items-center justify-center border-2 border-saffron-500/60 text-saffron-100 font-semibold py-3 px-8 rounded-md hover:bg-saffron-500/10 transition-all duration-300"
          >
            Software & POS
          </Link>
          <Link
            to="/wealth-tools/country-comparison-master-dashboard"
            className="inline-flex items-center justify-center border-2 border-bjp-green/50 text-saffron-100 font-semibold py-3 px-8 rounded-md hover:bg-bjp-green/10 transition-all duration-300"
          >
            CountryScope Dashboard
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <a href="#sanatan-dharma" className="text-saffron-300 hover:text-white" aria-label="Scroll down">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
