import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Hourglass, ChevronDown } from 'lucide-react';

// Import services data from Services.tsx
const getServicesData = () => {
  return [
    {
      title: 'Device Repair',
      components: [
        { id: 'micro-soldering', name: 'Micro Soldering', description: 'Logic board and FPC connector repair' },
        { id: 'backlight-repair', name: 'Backlight Circuit Repair', description: 'Screen backlight troubleshooting' },
        { id: 'laptop-repair', name: 'Laptop Repair', description: 'Complete laptop diagnostics and repair' },
        { id: 'phone-repair', name: 'Phone Repair', description: 'Screen, battery, and component replacement' },
        { id: 'console-repair', name: 'Game Console Repair', description: 'PlayStation, Xbox, Nintendo repairs' },
        { id: 'tablet-repair', name: 'Tablet Repair', description: 'Screen and component replacement' }
      ]
    },
    {
      title: 'Custom Software Development',
      components: [
        { id: 'web-app', name: 'Web Application', description: 'Custom web application development' },
        { id: 'desktop-app', name: 'Desktop Application', description: 'Cross-platform desktop software' },
        { id: 'api-development', name: 'API Development', description: 'RESTful API and microservices' },
        { id: 'database-design', name: 'Database Design', description: 'Custom database architecture' },
        { id: 'software-integration', name: 'Software Integration', description: 'Third-party system integration' }
      ]
    },
    {
      title: 'Mobile App Development',
      components: [
        { id: 'ios-app', name: 'iOS App Development', description: 'Native iOS application' },
        { id: 'android-app', name: 'Android App Development', description: 'Native Android application' },
        { id: 'cross-platform', name: 'Cross-Platform App', description: 'React Native or Flutter app' },
        { id: 'app-maintenance', name: 'App Maintenance', description: 'Ongoing app support and updates' },
        { id: 'app-store-optimization', name: 'App Store Optimization', description: 'ASO and publishing support' }
      ]
    },
    {
      title: 'Cloud Solutions',
      components: [
        { id: 'cloud-migration', name: 'Cloud Migration', description: 'Move existing systems to cloud' },
        { id: 'cloud-setup', name: 'Cloud Infrastructure Setup', description: 'AWS, Azure, or GCP setup' },
        { id: 'cloud-monitoring', name: 'Cloud Monitoring', description: '24/7 cloud infrastructure monitoring' },
        { id: 'backup-solutions', name: 'Backup Solutions', description: 'Automated cloud backup systems' },
        { id: 'load-balancing', name: 'Load Balancing', description: 'High availability configuration' }
      ]
    },
    {
      title: 'Data Recovery',
      components: [
        { id: 'hdd-recovery', name: 'Hard Drive Recovery', description: 'Mechanical and logical HDD recovery' },
        { id: 'ssd-recovery', name: 'SSD Recovery', description: 'Solid state drive data recovery' },
        { id: 'phone-data-recovery', name: 'Phone Data Recovery', description: 'Mobile device data extraction' },
        { id: 'raid-recovery', name: 'RAID Recovery', description: 'RAID array reconstruction' },
        { id: 'emergency-recovery', name: 'Emergency Recovery', description: '24-hour rush data recovery' }
      ]
    },
    {
      title: 'Cybersecurity',
      components: [
        { id: 'security-audit', name: 'Security Audit', description: 'Comprehensive security assessment' },
        { id: 'penetration-testing', name: 'Penetration Testing', description: 'Ethical hacking and vulnerability testing' },
        { id: 'firewall-setup', name: 'Firewall Configuration', description: 'Network firewall implementation' },
        { id: 'security-training', name: 'Security Training', description: 'Employee security awareness training' },
        { id: 'incident-response', name: 'Incident Response', description: 'Security incident handling plan' }
      ]
    },
    {
      title: 'Data Analytics',
      components: [
        { id: 'dashboard-development', name: 'Dashboard Development', description: 'Custom analytics dashboards' },
        { id: 'data-visualization', name: 'Data Visualization', description: 'Interactive charts and reports' },
        { id: 'business-intelligence', name: 'Business Intelligence', description: 'BI system implementation' },
        { id: 'data-modeling', name: 'Data Modeling', description: 'Data warehouse design' },
        { id: 'predictive-analytics', name: 'Predictive Analytics', description: 'Machine learning models' }
      ]
    },
    {
      title: 'Drone Repairs',
      components: [
        { id: 'motor-replacement', name: 'Motor Replacement', description: 'Drone motor repair and replacement' },
        { id: 'flight-controller', name: 'Flight Controller Repair', description: 'FC diagnostics and repair' },
        { id: 'gimbal-repair', name: 'Gimbal Repair', description: 'Camera gimbal stabilization repair' },
        { id: 'battery-service', name: 'Battery Service', description: 'Battery testing and replacement' },
        { id: 'firmware-update', name: 'Firmware Update', description: 'Drone firmware upgrade service' }
      ]
    },
    {
      title: 'Digital Marketing',
      components: [
        { id: 'seo-optimization', name: 'SEO Optimization', description: 'Search engine optimization campaign' },
        { id: 'ppc-management', name: 'PPC Management', description: 'Google Ads and social media ads' },
        { id: 'social-media', name: 'Social Media Marketing', description: 'Social media strategy and management' },
        { id: 'content-creation', name: 'Content Creation', description: 'Blog posts, articles, and copywriting' },
        { id: 'email-marketing', name: 'Email Marketing', description: 'Email campaign design and automation' }
      ]
    },
    {
      title: 'IT Support',
      components: [
        { id: 'helpdesk-support', name: 'Helpdesk Support', description: '24/7 remote IT support' },
        { id: 'on-site-support', name: 'On-Site Support', description: 'Technical support at your location' },
        { id: 'network-setup', name: 'Network Setup', description: 'Business network configuration' },
        { id: 'system-monitoring', name: 'System Monitoring', description: 'Proactive system health monitoring' },
        { id: 'software-installation', name: 'Software Installation', description: 'Software deployment and configuration' }
      ]
    },
    {
      title: 'Graphics Design',
      components: [
        { id: 'logo-design', name: 'Logo Design', description: 'Custom logo and brand identity' },
        { id: 'business-cards', name: 'Business Cards', description: 'Professional business card design' },
        { id: 'brochure-design', name: 'Brochure Design', description: 'Marketing brochure and flyer design' },
        { id: 'web-graphics', name: 'Web Graphics', description: 'Website graphics and banners' },
        { id: 'brand-package', name: 'Complete Brand Package', description: 'Full brand identity package' }
      ]
    }
  ];
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    component: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showComponentDropdown, setShowComponentDropdown] = useState(false);

  const services = getServicesData();
  const selectedService = services.find(service => service.title === formData.subject);
  const availableComponents = selectedService ? selectedService.components : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send to your Hostinger PHP mailer endpoint
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `${formData.subject}${formData.component ? ` - ${formData.component}` : ''}`,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', component: '', message: '' });
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceSelect = (serviceTitle: string) => {
    setFormData({
      ...formData,
      subject: serviceTitle,
      component: '' // Reset component when service changes
    });
    setShowServiceDropdown(false);
  };

  const handleComponentSelect = (componentName: string) => {
    setFormData({
      ...formData,
      component: componentName
    });
    setShowComponentDropdown(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: ' 6119 186 St, Surrey, BC V3S7P5'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (778) 793-4640'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@bytewaveinnovations.ca'
    },
    {
      icon: Hourglass,
      title: 'Working Hours',
      content: '24/7 Open'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-primary via-blue-600 to-secondary text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex items-start gap-12">
          <motion.div 
            className="lg:w-1/2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get In <span className="text-yellow-300">Touch</span>
            </h2>
            <p className="mb-8 opacity-90 text-lg">
              Ready to start your next project with us? Send us a message and we'll get back to you within 24 hours.
            </p>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="flex-shrink-0 mr-4"
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <info.icon size={24} className="text-yellow-300" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg">{info.title}</h3>
                    <p className="opacity-90">{info.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl p-8 text-dark"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h3>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center"
                >
                  <CheckCircle size={20} className="mr-2" />
                  Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center"
                >
                  <AlertCircle size={20} className="mr-2" />
                  Failed to send message. Please try again or contact us directly.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                    disabled={isSubmitting}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                    disabled={isSubmitting}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Service *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-left bg-white flex items-center justify-between"
                      disabled={isSubmitting}
                    >
                      <span className={formData.subject ? 'text-gray-900' : 'text-gray-500'}>
                        {formData.subject || 'Select a service...'}
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={`transition-transform duration-200 ${showServiceDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {showServiceDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {services.map((service) => (
                          <button
                            key={service.title}
                            type="button"
                            onClick={() => handleServiceSelect(service.title)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                          >
                            {service.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Component Selection - Only show if a service is selected */}
                {formData.subject && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="component" className="block text-gray-700 font-medium mb-2">
                      Specific Component (Optional)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowComponentDropdown(!showComponentDropdown)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-left bg-white flex items-center justify-between"
                        disabled={isSubmitting}
                      >
                        <span className={formData.component ? 'text-gray-900' : 'text-gray-500'}>
                          {formData.component || 'Select a component...'}
                        </span>
                        <ChevronDown 
                          size={20} 
                          className={`transition-transform duration-200 ${showComponentDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {showComponentDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          <button
                            type="button"
                            onClick={() => handleComponentSelect('')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 text-gray-500 italic"
                          >
                            No specific component
                          </button>
                          {availableComponents.map((component) => (
                            <button
                              key={component.id}
                              type="button"
                              onClick={() => handleComponentSelect(component.name)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div>
                                <div className="font-medium">{component.name}</div>
                                <div className="text-sm text-gray-500">{component.description}</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </motion.div>
                
                <motion.button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg'
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Send size={20} />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </form>
              
              <motion.p 
                className="text-sm text-gray-500 mt-4 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                * Required fields. We respect your privacy and will never share your information.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;