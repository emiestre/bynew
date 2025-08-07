import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Send, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

// Import services data
const servicesData = [
  {
    title: "Web Development",
    components: [
      { name: "Frontend Development", description: "React, Vue, Angular applications" },
      { name: "Backend Development", description: "Node.js, Python, PHP APIs" },
      { name: "Full-Stack Solutions", description: "Complete web applications" },
      { name: "E-commerce Platforms", description: "Online stores and marketplaces" }
    ]
  },
  {
    title: "Mobile App Development",
    components: [
      { name: "iOS Development", description: "Native iOS applications" },
      { name: "Android Development", description: "Native Android applications" },
      { name: "Cross-Platform Apps", description: "React Native, Flutter apps" },
      { name: "App Store Optimization", description: "ASO and app marketing" }
    ]
  },
  {
    title: "UI/UX Design",
    components: [
      { name: "User Interface Design", description: "Modern, intuitive interfaces" },
      { name: "User Experience Research", description: "User testing and research" },
      { name: "Prototyping", description: "Interactive prototypes" },
      { name: "Design Systems", description: "Scalable design frameworks" }
    ]
  },
  {
    title: "Digital Marketing",
    components: [
      { name: "SEO Optimization", description: "Search engine optimization" },
      { name: "Social Media Marketing", description: "Social platform strategies" },
      { name: "Content Marketing", description: "Content strategy and creation" },
      { name: "PPC Advertising", description: "Paid advertising campaigns" }
    ]
  }
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  component: string;
  message: string;
}

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    component: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [componentDropdownOpen, setComponentDropdownOpen] = useState(false);

  const selectedService = servicesData.find(service => service.title === formData.service);
  const availableComponents = selectedService ? selectedService.components : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceSelect = (service: string) => {
    setFormData(prev => ({
      ...prev,
      service,
      component: '' // Reset component when service changes
    }));
    setServiceDropdownOpen(false);
    setComponentDropdownOpen(false);
  };

  const handleComponentSelect = (component: string) => {
    setFormData(prev => ({
      ...prev,
      component
    }));
    setComponentDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          component: '',
          message: ''
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Get In Touch
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to start your project? Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm sm:text-base text-gray-600">hello@company.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-sm sm:text-base text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Office</p>
                      <p className="text-sm sm:text-base text-gray-600">123 Business St, City, State 12345</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Service Selection Dropdown */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Service Interested In *
                  </Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                    >
                      <span className={formData.service ? 'text-gray-900' : 'text-gray-500'}>
                        {formData.service || 'Select a service...'}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
                          serviceDropdownOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    <AnimatePresence>
                      {serviceDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          {servicesData.map((service) => (
                            <button
                              key={service.title}
                              type="button"
                              onClick={() => handleServiceSelect(service.title)}
                              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                            >
                              <span className="font-medium text-gray-900">{service.title}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Component Selection Dropdown */}
                <AnimatePresence>
                  {formData.service && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <Label className="text-sm font-medium text-gray-700">
                        Specific Component
                      </Label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setComponentDropdownOpen(!componentDropdownOpen)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                        >
                          <span className={formData.component ? 'text-gray-900' : 'text-gray-500'}>
                            {formData.component || 'Select a component (optional)...'}
                          </span>
                          <ChevronDown 
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
                              componentDropdownOpen ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        <AnimatePresence>
                          {componentDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                              <button
                                type="button"
                                onClick={() => handleComponentSelect('')}
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                              >
                                <span className="text-gray-500 italic">No specific component</span>
                              </button>
                              {availableComponents.map((component) => (
                                <button
                                  key={component.name}
                                  type="button"
                                  onClick={() => handleComponentSelect(component.name)}
                                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 last:rounded-b-lg"
                                >
                                  <div>
                                    <span className="font-medium text-gray-900 block truncate">
                                      {component.name}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-500 block truncate">
                                      {component.description}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;