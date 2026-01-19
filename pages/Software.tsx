import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Code, Database, Shield, Zap, Cpu, BarChart3, ExternalLink, type LucideIcon } from 'lucide-react';
import { loadSoftwareProjects } from '../lib/loadSoftwareProjects';

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Code,
  Cpu,
  Database,
  Shield,
  Zap,
};

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

interface SoftwareCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  image: string;
  index: number;
}

function SoftwareCard({ title, description, features, icon, image, index }: SoftwareCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="w-full md:w-3/5 p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-white ml-4">{title}</h3>
          </div>
          
          <p className="text-purple-100 mb-6">{description}</p>
          
          <div className="mb-4 flex-grow">
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Key Features:</h4>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button className="mt-auto flex items-center text-sm text-purple-300 hover:text-white transition-colors duration-200">
            <span>Request Demo</span>
            <ExternalLink size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Software() {
  const softwareProducts = useMemo(() => {
    const raw = loadSoftwareProjects();
    return raw.map((p) => {
      const Icon = ICON_MAP[p.icon] ?? Code;
      return { ...p, icon: <Icon size={24} /> };
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050108]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Software Solutions</h1>
            <p className="text-purple-200 max-w-2xl mx-auto text-lg">
              Cutting-edge software platforms and tools powering digital transformation across industries
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4"></div>
          </motion.div>

          <div className="space-y-12">
            {softwareProducts.map((product, index) => (
              <SoftwareCard
                key={index}
                title={product.title}
                description={product.description}
                features={product.features}
                icon={product.icon}
                image={product.image}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Looking for a Custom Solution?</h2>
          <p className="text-purple-200 mb-8">
            Our team of experts can develop tailored software solutions to meet your specific business needs and challenges.
          </p>
          <a 
            href="#contact" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 px-8 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Contact Us Today
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}