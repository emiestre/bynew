import React from 'react';
import { motion } from 'framer-motion';

const Clients = () => {
  const clients = [
    { name: 'Amazon', logo: './amazon.png' },
    { name: 'Apple', logo: './apple.png' },
    { name: 'Emiestre', logo: './emiestre.png'},
    { name: 'Microsoft', logo: './microsoft.png' },
    { name: 'Google', logo: './google.png' },
   
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-center text-2xl font-semibold text-gray-500 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted by innovative companies worldwide
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={client.logo} 
                alt={client.name} 
                className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;