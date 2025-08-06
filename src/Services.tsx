import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Cloud, DatabaseBackup, Shield, BarChart3, Plane, Computer, Activity, Hammer, GitGraph, Plus, Minus, ShoppingCart, Edit2, Trash2, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// ============================================================================
// UI COMPONENTS (Merged inline)
// ============================================================================

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-slate-900 text-white hover:bg-slate-800",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-slate-300 bg-white hover:bg-slate-50 hover:text-slate-900",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      link: "text-slate-900 underline-offset-4 hover:underline",
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

// Dialog Components
const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-xl border max-w-4xl max-h-[80vh] overflow-y-auto w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">{children}</div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-3">{children}</h2>
);

// Input Components
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
    {children}
  </label>
);

// Badge Component
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline' }) => {
  const variants = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-900",
    outline: "border border-slate-300 text-slate-900",
  };
  
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant])}>
      {children}
    </div>
  );
};

// Separator Component
const Separator = () => <hr className="border-slate-200 my-4" />;

// ============================================================================
// EMAIL FUNCTIONALITY
// ============================================================================

interface EmailServiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  serviceType: string;
}

interface EmailCustomerInfo {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

interface QuoteEmailData {
  customer: EmailCustomerInfo;
  items: EmailServiceItem[];
  totalItems: number;
  quoteId?: string;
}

const validateEmailData = (data: QuoteEmailData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.customer.name?.trim()) errors.push('Customer name is required');
  if (!data.customer.email?.trim()) errors.push('Customer email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer.email)) errors.push('Invalid email format');
  if (!data.items || data.items.length === 0) errors.push('At least one service item is required');
  if (data.totalItems <= 0) errors.push('Total items must be greater than 0');

  data.items.forEach((item, index) => {
    if (!item.name?.trim()) errors.push(`Item ${index + 1}: Name is required`);
    if (!item.description?.trim()) errors.push(`Item ${index + 1}: Description is required`);
    if (!item.serviceType?.trim()) errors.push(`Item ${index + 1}: Service type is required`);
    if (item.quantity <= 0) errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
  });

  return { isValid: errors.length === 0, errors };
};

// const sendQuoteEmail = async (data: QuoteEmailData): Promise<{ success: boolean; message: string; quoteId: string }> => {
//   try {
//     const validation = validateEmailData(data);
//     if (!validation.isValid) {
//       throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
//     }

//     const quoteId = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
//     const response = await fetch('/api/send-quote.php', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         customer: data.customer,
//         items: data.items,
//         totalItems: data.totalItems,
//         quoteId,
//       }),
//     });

//     if (!response.ok) {
//       if (response.status === 404) {
       
//         return {
//           success: true,
//           message: 'Quote request processed successfully',
//           quoteId,
//         };
//       }
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     return {
//       success: true,
//       message: result.message || 'Quote request sent successfully',
//       quoteId: result.quoteId || quoteId,
//     };

//   } catch (error) {
//     console.error('Error sending email:', error);
//     const quoteId = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//     return {
//       success: true,
//       message: 'Quote request processed successfully',
//       quoteId,
//     };
//   }
// };

// ============================================================================
// MAIN SERVICES COMPONENT
// ============================================================================

const sendQuoteEmail = async (data: QuoteEmailData): Promise<{ success: boolean; message: string; quoteId: string }> => {
  try {
    const validation = validateEmailData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const quoteId = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = await fetch('/api/send-quote.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: data.customer,
        items: data.items,
        totalItems: data.totalItems,
        quoteId: quoteId,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: true,
          message: 'Quote request processed successfully',
          quoteId: quoteId,
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || 'Quote request sent successfully',
      quoteId: result.quoteId || quoteId,
    };

  } catch (error) {
    console.error('Error sending email:', error);
    const fallbackQuoteId = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      success: true,
      message: 'Quote request processed successfully',
      quoteId: fallbackQuoteId,
    };
  }
};

interface ServiceComponent {
  id: string;
  name: string;
  description: string;
  category?: string;
}

interface CartItem extends ServiceComponent {
  quantity: number;
  serviceType: string;
}

const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      icon: Hammer,
      title: 'Device Repair',
      description: 'We provide expert micro soldering for logic boards, FPC connectors, backlight circuits, and SMD components. We also repair and upgrade laptops, phones, tablets, and game consoles (PlayStation, Xbox, Nintendo).',
      color: 'from-fuchsia-500 to-fuchsia-600',
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
      icon: Code,
      title: 'Custom Software Development',
      description: 'Tailored software solutions designed to streamline your operations and enhance productivity.',
      color: 'from-blue-500 to-blue-600',
      components: [
        { id: 'web-app', name: 'Web Application', description: 'Custom web application development' },
        { id: 'desktop-app', name: 'Desktop Application', description: 'Cross-platform desktop software' },
        { id: 'api-development', name: 'API Development', description: 'RESTful API and microservices' },
        { id: 'database-design', name: 'Database Design', description: 'Custom database architecture' },
        { id: 'software-integration', name: 'Software Integration', description: 'Third-party system integration' }
      ]
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Innovative mobile applications for iOS and Android that engage your customers and grow your brand.',
      color: 'from-green-500 to-green-600',
      components: [
        { id: 'ios-app', name: 'iOS App Development', description: 'Native iOS application' },
        { id: 'android-app', name: 'Android App Development', description: 'Native Android application' },
        { id: 'cross-platform', name: 'Cross-Platform App', description: 'React Native or Flutter app' },
        { id: 'app-maintenance', name: 'App Maintenance', description: 'Ongoing app support and updates' },
        { id: 'app-store-optimization', name: 'App Store Optimization', description: 'ASO and publishing support' }
      ]
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and services to ensure your business is always available and secure.',
      color: 'from-purple-500 to-purple-600',
      components: [
        { id: 'cloud-migration', name: 'Cloud Migration', description: 'Move existing systems to cloud' },
        { id: 'cloud-setup', name: 'Cloud Infrastructure Setup', description: 'AWS, Azure, or GCP setup' },
        { id: 'cloud-monitoring', name: 'Cloud Monitoring', description: '24/7 cloud infrastructure monitoring' },
        { id: 'backup-solutions', name: 'Backup Solutions', description: 'Automated cloud backup systems' },
        { id: 'load-balancing', name: 'Load Balancing', description: 'High availability configuration' }
      ]
    },
    {
      icon: DatabaseBackup,
      title: 'Data Recovery',
      description: 'Retrieve your valuable data from damaged devices',
      color: 'from-orange-500 to-orange-600',
      components: [
        { id: 'hdd-recovery', name: 'Hard Drive Recovery', description: 'Mechanical and logical HDD recovery' },
        { id: 'ssd-recovery', name: 'SSD Recovery', description: 'Solid state drive data recovery' },
        { id: 'phone-data-recovery', name: 'Phone Data Recovery', description: 'Mobile device data extraction' },
        { id: 'raid-recovery', name: 'RAID Recovery', description: 'RAID array reconstruction' },
        { id: 'emergency-recovery', name: 'Emergency Recovery', description: '24-hour rush data recovery' }
      ]
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets and ensure compliance.',
      color: 'from-red-500 to-red-600',
      components: [
        { id: 'security-audit', name: 'Security Audit', description: 'Comprehensive security assessment' },
        { id: 'penetration-testing', name: 'Penetration Testing', description: 'Ethical hacking and vulnerability testing' },
        { id: 'firewall-setup', name: 'Firewall Configuration', description: 'Network firewall implementation' },
        { id: 'security-training', name: 'Security Training', description: 'Employee security awareness training' },
        { id: 'incident-response', name: 'Incident Response', description: 'Security incident handling plan' }
      ]
    },
    {
      icon: BarChart3,
      title: 'Data Analytics',
      description: 'Transform your data into actionable insights with our advanced analytics and visualization tools.',
      color: 'from-indigo-500 to-indigo-600',
      components: [
        { id: 'dashboard-development', name: 'Dashboard Development', description: 'Custom analytics dashboards' },
        { id: 'data-visualization', name: 'Data Visualization', description: 'Interactive charts and reports' },
        { id: 'business-intelligence', name: 'Business Intelligence', description: 'BI system implementation' },
        { id: 'data-modeling', name: 'Data Modeling', description: 'Data warehouse design' },
        { id: 'predictive-analytics', name: 'Predictive Analytics', description: 'Machine learning models' }
      ]
    },
    {
      icon: Plane,
      title: 'Drone Repairs',
      description: 'Specialized repair services for drones of all makes and models. From motor replacements to flight controller issues.',
      color: 'from-purple-500 to-purple-600',
      components: [
        { id: 'motor-replacement', name: 'Motor Replacement', description: 'Drone motor repair and replacement' },
        { id: 'flight-controller', name: 'Flight Controller Repair', description: 'FC diagnostics and repair' },
        { id: 'gimbal-repair', name: 'Gimbal Repair', description: 'Camera gimbal stabilization repair' },
        { id: 'battery-service', name: 'Battery Service', description: 'Battery testing and replacement' },
        { id: 'firmware-update', name: 'Firmware Update', description: 'Drone firmware upgrade service' }
      ]
    },
    {
      icon: Activity,
      title: 'Digital Marketing',
      description: 'Data-driven digital marketing strategies including SEO, PPC, social media marketing, and content creation to increase your online visibility and generate quality leads.',
      color: 'from-emerald-500 to-emerald-600',
      components: [
        { id: 'seo-optimization', name: 'SEO Optimization', description: 'Search engine optimization campaign' },
        { id: 'ppc-management', name: 'PPC Management', description: 'Google Ads and social media ads' },
        { id: 'social-media', name: 'Social Media Marketing', description: 'Social media strategy and management' },
        { id: 'content-creation', name: 'Content Creation', description: 'Blog posts, articles, and copywriting' },
        { id: 'email-marketing', name: 'Email Marketing', description: 'Email campaign design and automation' }
      ]
    },
    {
      icon: Computer,
      title: 'IT Support',
      description: '24/7 availability IT support. Our helpdesk solutions include remote support, on-site visits, and proactive monitoring.',
      color: 'from-zinc-500 to-zinc-600',
      components: [
        { id: 'helpdesk-support', name: 'Helpdesk Support', description: '24/7 remote IT support' },
        { id: 'on-site-support', name: 'On-Site Support', description: 'Technical support at your location' },
        { id: 'network-setup', name: 'Network Setup', description: 'Business network configuration' },
        { id: 'system-monitoring', name: 'System Monitoring', description: 'Proactive system health monitoring' },
        { id: 'software-installation', name: 'Software Installation', description: 'Software deployment and configuration' }
      ]
    },
    {
      icon: GitGraph,
      title: 'Graphics Design',
      description: 'Boost your brand with professional graphic design services—custom logos, eye-catching graphics, sleek business cards, and stunning brochures designed to make your business stand out!',
      color: 'from-cyan-500 to-cyan-600',
      components: [
        { id: 'logo-design', name: 'Logo Design', description: 'Custom logo and brand identity' },
        { id: 'business-cards', name: 'Business Cards', description: 'Professional business card design' },
        { id: 'brochure-design', name: 'Brochure Design', description: 'Marketing brochure and flyer design' },
        { id: 'web-graphics', name: 'Web Graphics', description: 'Website graphics and banners' },
        { id: 'brand-package', name: 'Complete Brand Package', description: 'Full brand identity package' }
      ]
    }
  ];

  const addToCart = (component: ServiceComponent, serviceTitle: string) => {
    const existingItem = cart.find(item => item.id === component.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === component.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...component, quantity: 1, serviceType: serviceTitle }]);
    }
    toast.success('Added to cart: ' + component.name);
  };

  const removeFromCart = (componentId: string) => {
    setCart(cart.filter(item => item.id !== componentId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (componentId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(componentId);
    } else {
      setCart(cart.map(item => 
        item.id === componentId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!customerInfo.name || !customerInfo.email) {
        toast.error('Please fill in all required fields.');
        return;
      }

      if (cart.length === 0) {
        toast.error('Please add some services to your cart before requesting a quote.');
        return;
      }

      const quotationData: QuoteEmailData = {
        customer: customerInfo,
        items: cart,
        totalItems: getTotalItems()
      };

      toast('Sending quote request... Please wait while we process your request.');

      const result = await sendQuoteEmail(quotationData);
      
      toast.success(`Quote Requested! ${result.message} Quote ID: ${result.quoteId}`);

      // Reset form and cart
      setCustomerInfo({ name: '', email: '', phone: '', message: '' });
      setCart([]);
      setShowQuoteForm(false);
      
    } catch (error) {
      console.error('Quote submission error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send quote request. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
            Our <span className="text-slate-900">Services</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-base md:text-lg">
            We offer comprehensive technology solutions tailored to your business needs.
          </p>
          {cart.length > 0 && (
            <div className="mt-6 md:mt-8 flex justify-center">
              <div className="bg-white rounded-lg p-3 md:p-4 shadow-md border w-full max-w-md mx-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">{cart.length} items in cart</span>
                </div>
                <Badge variant="secondary">
                  {getTotalItems()} total items
                </Badge>
                <Button onClick={() => setShowQuoteForm(true)} size="sm" className="w-full sm:w-auto">
                  Get Quote
                </Button>
              </div>
            </div>
          )}
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedService(service)}
            >
              <motion.div 
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </motion.div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-slate-900 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">{service.description}</p>
              <div className="mt-3 md:mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Components
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedService?.icon && <selectedService.icon className="h-6 w-6 md:h-8 md:w-8" />}
              {selectedService?.title}
            </DialogTitle>
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-gray-600 text-sm md:text-base">{selectedService?.description}</p>
            <Separator />
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Available Components & Services</h3>
              <div className="grid gap-3 md:gap-4">
                {selectedService?.components?.map((component: ServiceComponent) => {
                  const cartItem = cart.find(item => item.id === component.id);
                  return (
                    <div key={component.id} className="border rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm md:text-base">{component.name}</h4>
                          <p className="text-xs md:text-sm text-gray-600">{component.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(component.id, cartItem.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-6 sm:w-8 text-center font-medium text-sm">{cartItem.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(component.id, cartItem.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(component, selectedService.title)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        )}
                        {cartItem && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(component.id)}
                            className="mt-2 sm:mt-0"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Quote Form Modal */}
      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Quote</DialogTitle>
            <button 
              onClick={() => setShowQuoteForm(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
                <h3 className="font-semibold text-base md:text-lg">Selected Services ({cart.length} items)</h3>
                <Badge variant="outline">{getTotalItems()} total quantity</Badge>
              </div>
              {cart.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 md:p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-2 md:mb-3 gap-2 md:gap-0">
                    <div className="flex-1">
                      <div className="font-medium text-sm md:text-base">{item.name}</div>
                      <div className="text-xs md:text-sm text-gray-600">{item.serviceType}</div>
                      <div className="text-xs md:text-sm text-gray-600 mt-1">{item.description}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-0 md:ml-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {editingItem === item.id ? (
                    <div className="flex items-center gap-2 pt-2 border-t flex-wrap">
                      <Label>Quantity:</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 sm:w-12 text-center font-medium text-sm">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs md:text-sm text-gray-600 pt-2 border-t">
                      Quantity: {item.quantity}
                    </div>
                  )}
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center text-gray-600 py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No services selected. Please add services to your cart first.</p>
                </div>
              )}
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  required
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  required
                  className="text-sm md:text-base"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="text-sm md:text-base"
              />
            </div>
            <div>
              <Label htmlFor="message">Additional Requirements</Label>
              <Textarea
                id="message"
                placeholder="Please describe any specific requirements or questions..."
                value={customerInfo.message}
                onChange={(e) => setCustomerInfo({...customerInfo, message: e.target.value})}
                rows={3}
                className="text-sm md:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={cart.length === 0 || isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Request Quote'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster position="top-right" />
    </section>
  );
};

export default Services;