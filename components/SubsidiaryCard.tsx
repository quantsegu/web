import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export interface SubsidiaryBrand {
  name: string;
  image: string;
  description: string;
  details: string;
  url: string;
}

interface SubsidiaryCardProps {
  name: string;
  description: string;
  details: string;
  locations: string[];
  logo: string;
  index: number;
  url?: string;
  brands?: SubsidiaryBrand[];
}

export default function SubsidiaryCard({ 
  name, 
  description, 
  details, 
  locations, 
  logo, 
  index,
  url,
  brands,
}: SubsidiaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedMaxHeight = brands?.length ? 'max-h-[2400px]' : 'max-h-96';

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
        
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? expandedMaxHeight : 'max-h-0'}`}>
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

          {brands && brands.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-saffron-300 mb-3">Brands & partners</h4>
              <div className="grid grid-cols-1 gap-4">
                {brands.map((brand) => (
                  <a
                    key={brand.url}
                    href={brand.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-4 rounded-lg bg-black/30 ring-1 ring-saffron-500/10 hover:ring-saffron-500/40 transition-all"
                  >
                    <div className="shrink-0 w-20 h-20 rounded-lg bg-white/95 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={brand.image}
                        alt={`${brand.name} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-white font-semibold group-hover:text-saffron-100 transition-colors">
                        {brand.name}
                      </h5>
                      <p className="text-saffron-50/90 text-sm mt-1">{brand.description}</p>
                      <p className="text-gray-400 text-xs mt-2 line-clamp-3">{brand.details}</p>
                      <span className="inline-flex items-center text-xs font-medium text-saffron-300 mt-2 group-hover:text-saffron-50">
                        Visit website
                        <ExternalLink size={12} className="ml-1" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
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
