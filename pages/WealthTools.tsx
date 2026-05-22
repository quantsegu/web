import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BarChart3, ClipboardList, ExternalLink, Globe, Home, LineChart, PiggyBank, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { wealthTools } from '../lib/wealthTools';

const ICONS = {
  universe: BarChart3,
  policy: ClipboardList,
  retirement: LineChart,
  portfolio: PiggyBank,
  tax: Scale,
  mortgage: Home,
  globe: Globe,
} as const;

export default function WealthTools() {
  return (
    <div className="min-h-screen w-full bg-[#050108]">
      <Navbar />

      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Wealth Tools</h1>
            <p className="text-saffron-100 max-w-2xl mx-auto text-lg">
              Personal finance calculators for retirement planning, passive income targets, and portfolio assumptions — private, browser-only, no account required.
            </p>
            <a
              href="/resources.html"
              className="inline-block mt-6 text-sm font-medium text-saffron-300 hover:text-white transition-colors"
            >
              Browse the full resources hub →
            </a>
            <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-bjp-green mx-auto mt-4" />
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {wealthTools.map((tool, index) => {
              const Icon = ICONS[tool.icon];
              return (
                <motion.article
                  key={tool.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="bg-black/40 backdrop-blur-md rounded-xl border border-saffron-500/15 p-6 flex flex-col h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-500 to-bjp-green flex items-center justify-center text-white shrink-0">
                      <Icon size={24} aria-hidden />
                    </div>
                    <h2 className="text-xl font-bold text-white">{tool.title}</h2>
                  </div>
                  <p className="text-saffron-50 mb-5 flex-grow">{tool.description}</p>
                  <ul className="space-y-2 mb-6">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-300 text-sm">
                        <span className="text-saffron-400 mr-2" aria-hidden>
                          •
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tool.href}
                    className="inline-flex items-center text-sm font-medium text-saffron-300 hover:text-white transition-colors duration-200"
                  >
                    <span>{tool.ctaLabel ?? 'Open tool'}</span>
                    <ExternalLink size={16} className="ml-2" aria-hidden />
                  </a>
                </motion.article>
              );
            })}
          </div>

          <p className="text-center text-gray-400 text-sm mt-12 max-w-xl mx-auto">
            Tools run entirely in your browser. Results are illustrative, not financial advice.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black/30 border-t border-saffron-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-3">More from Shreshti</h2>
          <p className="text-saffron-100 mb-6 text-sm">
            Explore software products and other resources on the main site.
          </p>
          <Link
            to="/software"
            className="inline-block bg-gradient-to-r from-saffron-500 to-bjp-green text-white font-medium py-2.5 px-6 rounded-full hover:from-saffron-600 hover:to-bjp-green-dark transition-all duration-300 text-sm"
          >
            View Software
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
