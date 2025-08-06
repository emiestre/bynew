import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechSolutions Inc.',
      image: 'https://randomuser.me/api/portraits/women/43.jpg',
      rating: 5,
      text: 'ByteWave transformed our digital infrastructure, resulting in a 40% increase in operational efficiency. Their team was professional, knowledgeable, and delivered beyond our expectations.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO, RetailGenius',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      text: 'The mobile app developed by ByteWave has been a game-changer for our business. User engagement increased by 75% within the first three months of launch.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Director, SecureFinance',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5,
      text: 'Their cybersecurity solutions protected us from multiple threats and ensured compliance with industry regulations. Highly recommend their services.'
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-primary">Clients</span> Say
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Don't just take our word for it - hear from our satisfied clients.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-gray-50 p-8 rounded-xl shadow-md relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div
                className="absolute top-4 right-4 text-primary opacity-20"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Quote size={40} />
              </motion.div>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                    >
                      <Star size={20} fill="currentColor" />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center">
                <motion.img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;