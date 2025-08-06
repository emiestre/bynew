import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, ArrowUp } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";


const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61575892603035', label: 'Facebook' },
    { icon: FaWhatsapp, href: 'https://wa.me/+1 (778) 793-4640', label: 'WhatsApp' },
    { icon: FaXTwitter, href: 'https://x.com/Bytewave2025', label: 'X (Twitter)' },
    { icon: Instagram, href: 'https://www.instagram.com/bytewaveinnovationslimited/', label: 'Instagram' },
    { icon: FaTiktok, href: 'https://www.tiktok.com/@bytewave2025', label: 'TikTok' },
  ];

  const footerLinks = {
    'Services': [
      'Custom Software Development',
      'Cloud Solutions',
      'Cybersecurity',
      'Data Analytics'
    ],
    'Company': [
      'About Us',
      'Careers',
      'News & Blog',
      'Contact Us'
    ],
    'Resources': [
      // { label: 'Privacy Policy', href: '/privacy-policy', tooltip: 'Read our Privacy Policy' },
      // { label: 'Terms of Service', href: '/terms-of-service', tooltip: 'View our Terms of Service' }
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
        tooltip: "Read our Privacy Policy",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
      },
      {
        label: "Terms of Service",
        href: "/terms-of-service",
        tooltip: "View our Terms of Service",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
      },
    ]
  };

  return (
    <footer className="bg-dark text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-16 h-16 bg-secondary/20 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <motion.img 
                src="./byte.png" 
                alt="ByteWave Innovations" 
                className="h-12 w-auto"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Delivering cutting-edge technology solutions to propel your business into the future. 
              Innovation, transformation, and success - that's our promise.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-primary hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-lg font-bold mb-4 text-primary">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={typeof link === 'string' ? link : link.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + linkIndex * 0.05 }}
                  >
                    {category === 'Resources' && typeof link !== 'string' ? (
                      <a 
                        href={link.href} 
                        className="text-gray-300 hover:text-white transition-colors duration-300 block py-1"
                        title={link.tooltip}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a 
                        href="#" 
                        className="text-gray-300 hover:text-white transition-colors duration-300 block py-1"
                      >
                        {typeof link === 'string' ? link : link.label}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-gray-300 text-sm mb-4 md:mb-0">
        <p>
          Copyright &copy; {currentYear}{" "}
          <a className="bg-gradient-to-br from-primary via-blue-600 to-secondary bg-clip-text text-transparent font-bold" href="/">
            Bytewave Innovations Ltd
          </a>
          &nbsp; All Rights Reserved.
        </p>
        Powered by
        <a className="bg-gradient-to-br from-primary via-blue-600 to-secondary bg-clip-text text-transparent font-bold" href="mailto:kemiestre@gmail.com">
          {" "}
          Emiestre
        </a>
      </div>


          <motion.button
            onClick={scrollToTop}
            className="bg-primary hover:bg-blue-600 text-white p-3 rounded-full transition-all duration-300"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;