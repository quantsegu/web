import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface SubsidiaryCardProps {
  name: string;
  description: string;
  details: string;
  locations: string[];
  logo: string;
  index: number;
  url?: string;
}

export default function SubsidiaryCard({ 
  name, 
  description, 
  details, 
  locations, 
  logo, 
  index,
  url,
}: SubsidiaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-500 to-bjp-green flex items-center justify-center text-white font-bold text-xl">
            {logo}
          </div>
          <h3 className="text-xl font-bold text-white ml-4">{name}</h3>
        </div>
        
        <p className="text-saffron-50 mb-4">{description}</p>
        
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <p className="text-gray-300 mb-4">{details}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-saffron-300 mb-2">Operating in:</h4>
            <div className="flex flex-wrap gap-2">
              {locations.map((location, i) => (
                <span 
                  key={i} 
                  className="inline-block bg-bjp-green/20 text-saffron-100 text-xs px-3 py-1 rounded-full"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-saffron-300 hover:text-saffron-50 transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                <span>Learn more</span>
                <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-saffron-300 hover:text-saffron-50 transition-colors"
            >
              Visit website
              <ExternalLink size={16} className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}