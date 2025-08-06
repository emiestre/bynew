import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '150+', label: 'Clients', color: 'text-blue-500' },
    { icon: Award, value: '17+', label: 'Team Members', color: 'text-green-500' },
    { icon: Clock, value: '5', label: 'Years Experience', color: 'text-purple-500' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex items-center">
          <motion.div 
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About <span className="text-primary">ByteWave</span> Innovations
            </h2>
            <p className="text-gray-600 mb-6">
              
              BYTEWAVE INNOVATIONS LIMITED is a cutting-edge technology company based in British Columbia, Canada, delivering a dynamic range of services that bridge hardware expertise, custom software development, and digital transformation. The company empowers individuals and businesses with innovative solutions across IT, marketing, design, and data analytics.

            </p>
           
            
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className={`${stat.color} mb-2 flex justify-center`}
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <stat.icon size={32} />
                  </motion.div>
                  <motion.div 
                    className="text-4xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.2 + 0.3
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
              <motion.img 
                src="./group.png" 
                alt="Our Team" 
                className="w-full h-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <motion.div
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-lg z-0"
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 bg-primary rounded-lg z-0"
              animate={{ 
                rotate: [360, 180, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;