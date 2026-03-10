// Mock data for the admin dashboard
// Replace this with your actual data

export const mockProjects = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Modern e-commerce solution with advanced features including product catalog, shopping cart, and secure checkout",
    images: [
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    ],
    category: "Web Development",
    link: "https://example.com",
    services: ["Web Development", "UI/UX Design"],
  },
  {
    id: "2",
    title: "Mobile Banking App",
    description: "Secure and user-friendly banking application with real-time transactions and biometric authentication",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    ],
    category: "Mobile App",
    link: "https://example.com",
    services: ["Mobile App Development", "UI/UX Design"],
  },
  {
    id: "3",
    title: "Dashboard Analytics",
    description: "Real-time analytics dashboard for business intelligence with customizable widgets and reports",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
    ],
    category: "Web Development",
    link: "https://example.com",
    services: ["Web Development", "Digital Marketing"],
  },
];

export const mockServices = [
  {
    id: "1",
    title: "Web Development",
    description: "Custom web applications built with modern technologies",
    icon: "💻",
    price: "$2,500",
    features: ["Responsive Design", "SEO Optimized", "Fast Performance", "Custom CMS"],
    status: "active" as const,
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications",
    icon: "📱",
    price: "$5,000",
    features: ["iOS & Android", "Cloud Integration", "Push Notifications", "Analytics"],
    status: "active" as const,
  },
  {
    id: "3",
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interface designs",
    icon: "🎨",
    price: "$1,500",
    features: ["User Research", "Wireframing", "Prototyping", "Design System"],
    status: "active" as const,
  },
];

export const mockSliders = [
  {
    id: "1",
    title: "Welcome to Our Platform",
    subtitle: "Build amazing products with our modern solutions",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=600&fit=crop",
    buttonText: "Get Started",
    buttonLink: "#",
    order: 1,
    visible: true,
  },
  {
    id: "2",
    title: "Innovative Solutions",
    subtitle: "Transform your business with cutting-edge technology",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
    buttonText: "Learn More",
    buttonLink: "#",
    order: 2,
    visible: true,
  },
  {
    id: "3",
    title: "Expert Team",
    subtitle: "Work with industry professionals who deliver excellence",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    buttonText: "Meet the Team",
    buttonLink: "#",
    order: 3,
    visible: true,
  },
];

export const mockAboutData = {
  companyName: "TechCorp Solutions",
  tagline: "Innovating the Future of Technology",
  description:
    "We are a leading technology company dedicated to creating innovative solutions that transform businesses and improve lives. With a team of passionate professionals, we deliver cutting-edge products and services that exceed expectations.",
  mission:
    "To empower businesses with innovative technology solutions that drive growth, efficiency, and success in the digital age.",
  vision:
    "To be the world's most trusted technology partner, recognized for excellence, innovation, and positive impact on society.",
  founded: "2015",
  employees: "250+",
  clients: "500+",
  awards: "25+",
};

export const mockDashboardStats = {
  totalProjects: "24",
  activeServices: "18",
  sliderItems: "12",
  totalViews: "45.2K",
};

export const mockRecentActivity = [
  { action: "New project added", item: "Mobile App Design", time: "2 hours ago" },
  { action: "Service updated", item: "Web Development", time: "5 hours ago" },
  { action: "Slider created", item: "Hero Banner", time: "1 day ago" },
  { action: "About section edited", item: "Company Info", time: "2 days ago" },
];