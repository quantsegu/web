import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Globe, Send, Linkedin } from 'lucide-react';

const founders = [
  { name: "Lakshmi Narayana Segu", role: "Founder & CEO", image: "/founders/lakshmi-narayana-segu.jpg", linkedin: "https://www.linkedin.com/in/lakshmisegu/" },
  { name: "Lavanya Segu", role: "Co-Founder & COO · Balaji Foods", image: "/founders/lavanya.jpg", linkedin: "#" }
];

function FounderImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`bg-gray-700/50 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Photo</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-white mb-4">Our Founders</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            {founders.map((f, i) => (
              <a
                key={i}
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-saffron-500/50 flex-shrink-0">
                  <FounderImage src={f.image} alt={f.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-white font-medium mt-2 text-sm group-hover:text-saffron-300">{f.name}</span>
                <span className="text-saffron-300 text-xs">{f.role}</span>
                <Linkedin size={14} className="mt-1 text-saffron-400 group-hover:text-white" />
              </a>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-black/30 backdrop-blur-md rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">              
              <div className="flex items-start">
                <Mail className="text-saffron-400 mr-4 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-300">lakshmi@shreshti.nl</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Globe className="text-saffron-400 mr-4 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-medium">Global Presence</h4>
                  <p className="text-gray-300">Operating across Europe, Asia and Africa</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                <span className="inline-block bg-bjp-green/20 text-saffron-100 text-xs px-3 py-1 rounded-full">Netherlands</span>
                <span className="inline-block bg-bjp-green/20 text-saffron-100 text-xs px-3 py-1 rounded-full">Switzerland</span>
                <span className="inline-block bg-bjp-green/20 text-saffron-100 text-xs px-3 py-1 rounded-full">India</span>
                <span className="inline-block bg-bjp-green/20 text-saffron-100 text-xs px-3 py-1 rounded-full">Zambia</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <form onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-md rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-saffron-100 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-saffron-950/40 border border-saffron-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-white"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-saffron-100 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-saffron-950/40 border border-saffron-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-white"
                    placeholder="Your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-saffron-100 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-saffron-950/40 border border-saffron-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-white"
                    placeholder="Your message"
                  ></textarea>
                </div>
              </div>
              
              <button
                type="submit"
                className={`mt-6 flex items-center justify-center w-full bg-gradient-to-r from-saffron-500 to-bjp-green text-white font-medium py-2 px-4 rounded-lg hover:from-saffron-600 hover:to-bjp-green-dark transition-all duration-300 ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  'Message Sent!'
                ) : (
                  <>
                    Send Message
                    <Send size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}