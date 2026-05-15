import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">About Shreshti</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-bjp-green mx-auto"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-black/30 backdrop-blur-md rounded-xl p-8 text-white"
        >
          <p className="text-lg mb-6">
            Shreshti is a dynamic organization established in the Netherlands with a global footprint. We operate through multiple subsidiaries, each specializing in different sectors ranging from food distribution to financial services, AI solutions, and data management.
          </p>
          
          <p className="text-lg mb-6">
            Our mission is to create innovative solutions that address real-world challenges while fostering sustainable growth and development across diverse markets. With operations spanning Europe, Asia, and Africa, we leverage our international presence to deliver exceptional value to our clients and partners.
          </p>
          
          <p className="text-lg">
            At Shreshti, we believe in the power of collaboration, technological innovation, and cultural diversity to drive business excellence and create positive impact in the communities we serve.
          </p>
        </motion.div>
      </div>
    </section>
  );
}