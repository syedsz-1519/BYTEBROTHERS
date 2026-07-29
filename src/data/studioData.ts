export interface Project {
  id: string;
  title: string;
  category: 'Client Project' | 'Personal Project';
  type: string; // e.g. Logistics, Education, Corporate, Retail, Engineering
  year: string;
  lead: 'Syed' | 'Hamid' | 'Both';
  description: string;
  image: string;
  tags: string[];
  metrics?: string;
  status?: 'Live' | 'In Dev' | 'Case Study';
  demoType?: 'standard' | 'webgl' | 'analytics' | 'e-commerce';
  details?: {
    challenge: string;
    solution: string;
    stack: string[];
    link?: string;
  };
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  avatar: string;
  bio: string;
  highlights: string[];
  links: {
    github: string;
    linkedin: string;
    website?: string;
  };
  specialties: string[];
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  estTime?: string;
  features: string[];
  iconName: string;
}

export interface TechnicalTenet {
  number: string;
  category: string;
  title: string;
  description: string;
  iconName?: string;
}

export const FOUNDERS: Founder[] = [
  {
    id: 'syed',
    name: 'Syed',
    role: 'FOUNDER / CRAFTSMAN',
    subtitle: 'Single-file Efficiency Expert',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Specializing in animation-heavy front end architecture, Syed pioneered the Byte Brothers\' approach to single-file HTML/CSS/JS craftsmanship and scalable React ecosystems. By reducing dependency overhead, he creates lightning-fast experiences that defy conventional performance limits.',
    highlights: [
      'React Component Architecture',
      'Animation-Heavy UX Development',
      'V8 Engine Performance Tuning'
    ],
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    specialties: ['Frontend Architecture', 'Webflow Enterprise & Interactions', 'Figma-to-Webflow Engine', 'V8 Optimization']
  },
  {
    id: 'hamid',
    name: 'Hamid Kamal',
    role: 'FOUNDER / STRATEGIST',
    subtitle: 'Technical Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Leading the strategic vision and back-end integration of our projects, Hamid ensures that the beauty of the front end is matched by the robustness of the infrastructure. His philosophy centers on infinite scalability and cryptographic security.',
    highlights: [
      'Serverless Cloud Infrastructure',
      'Optimized Database Design',
      'Enterprise Security Protocol'
    ],
    links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    specialties: ['Distributed Systems', 'Webflow CMS Architecture', 'Cloud Native', 'API Protocols']
  }
];

export const TECHNICAL_TENETS: TechnicalTenet[] = [
  {
    number: '01',
    category: 'PERFORMANCE',
    title: 'Zero-Bloat Philosophy',
    description: 'Every line of code is intentional. We eliminate unnecessary libraries to ensure sub-second load times and flawless mobile execution.'
  },
  {
    number: '02',
    category: 'CRAFT',
    title: 'Pixel-Perfect',
    description: 'Design and code are one. We bridge the gap with meticulous attention to detail, maintaining mathematical proportion and crisp typography.'
  },
  {
    number: '03',
    category: 'FUTURE',
    title: 'Legacy Code',
    description: 'We write code for the developer of the future. Sustainable, readable, and documentation-first architectures built to last.'
  },
  {
    number: '04',
    category: 'STRUCTURE',
    title: 'Architectural Rigor',
    description: 'Our systems are built on scalable foundations, from state management to cloud infrastructure, designed to grow with your ambition.'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'webflow-apex-enterprise',
    title: 'Nexus Webflow Enterprise',
    category: 'Client Project',
    type: 'Webflow Enterprise',
    year: '2024',
    lead: 'Both',
    description: 'Ultra-high performance Webflow Enterprise platform featuring Client-First v2 architecture, custom GSAP interaction physics, dynamic CMS filters, and custom React embedded tools.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Webflow Enterprise', 'Client-First v2', 'Custom GSAP JS', 'Webflow CMS API', 'Relume UI'],
    metrics: '100/100 Lighthouse • 3.4x Conversion',
    status: 'Live',
    demoType: 'standard',
    details: {
      challenge: 'Client required an enterprise SaaS Webflow site capable of managing 1,000+ relational CMS articles, zero layout shift, and complex custom calculator widgets.',
      solution: 'Engineered a modular Webflow architecture built on Client-First v2 standards with embedded lightweight TypeScript modules and instant marketing editor access.',
      stack: ['Webflow Enterprise', 'Client-First CSS', 'Custom JS / GSAP', 'Webflow CMS API', 'Relume Library']
    }
  },
  {
    id: 'ali-logistics',
    title: 'Ali Logistics',
    category: 'Client Project',
    type: 'Logistics',
    year: '2023',
    lead: 'Syed',
    description: 'Next-gen supply chain management platform focusing on real-time fleet tracking and automated manifest generation.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: ['Logistics', 'Real-time Tracking', 'Fleet Analytics'],
    metrics: '99.98% Uptime • 42ms latency',
    status: 'Live',
    demoType: 'analytics',
    details: {
      challenge: 'Legacy dispatch systems suffered from 3-minute data sync delays and manual route calculations for over 500 trucks.',
      solution: 'Engineered a WebSocket-streamed telemetry dashboard with real-time routing algorithms and instant manifest generation.',
      stack: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS', 'Deck.gl']
    }
  },
  {
    id: 'qalbiya',
    title: 'Qalbiya',
    category: 'Client Project',
    type: 'Education',
    year: '2024',
    lead: 'Hamid',
    description: 'Digital learning ecosystem designed for streamlined course management and interactive student experiences.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Education', 'LMS', 'Interactive Learning'],
    metrics: '120k Active Students',
    status: 'Live',
    demoType: 'standard',
    details: {
      challenge: 'Needed a distraction-free, low-bandwidth academic platform capable of handling offline video streaming and progress syncing.',
      solution: 'Built a lightweight Progressive Web Application with offline IndexedDB storage and adaptive bitrate video playback.',
      stack: ['React', 'IndexedDB', 'Service Worker', 'Node.js', 'Express']
    }
  },
  {
    id: 'hassan-mohammad',
    title: 'Hassan Mohammad',
    category: 'Client Project',
    type: 'Corporate',
    year: '2023',
    lead: 'Syed',
    description: 'High-end executive portfolio focused on narrative storytelling and thought leadership positioning.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tags: ['Corporate', 'Executive', 'Editorial Design'],
    metrics: '3x Engagement Rate',
    status: 'Live',
    demoType: 'standard',
    details: {
      challenge: 'Required an ultra-luxurious digital web experience that communicates Fortune 500 advisory expertise without visual clutter.',
      solution: 'Created an editorial digital presentation with smooth web scroll transitions and custom typography scaling.',
      stack: ['React', 'Motion', 'Tailwind CSS', 'Vite']
    }
  },
  {
    id: 'kamal-selections',
    title: 'Kamal Selections',
    category: 'Client Project',
    type: 'Retail',
    year: '2024',
    lead: 'Hamid',
    description: 'Bespoke e-commerce experience with an emphasis on high-conversion visual catalogs and seamless checkout.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Retail', 'E-commerce', 'Bespoke UI'],
    metrics: '+48% Checkout Conversion',
    status: 'Live',
    demoType: 'e-commerce',
    details: {
      challenge: 'High bounce rate due to slow product image loading and multi-step cart redirection.',
      solution: 'Developed an instantaneous slide-over cart with optimistic UI updates and instant image caching.',
      stack: ['React', 'Headless Storefront', 'Tailwind CSS', 'Stripe API']
    }
  },
  {
    id: 'void-engine',
    title: 'Void Engine',
    category: 'Personal Project',
    type: 'Engineering',
    year: 'In Dev',
    lead: 'Syed',
    description: 'An experimental WebGL rendering framework designed for high-performance visual storytelling and browser-based 3D experiences.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['WebGL', '3D Graphics', 'Canvas API'],
    metrics: '60 FPS Canvas Output',
    status: 'In Dev',
    demoType: 'webgl',
    details: {
      challenge: 'Existing 3D web frameworks had heavy bundle sizes (800KB+) and poor frame stability on mobile chipsets.',
      solution: 'Custom shader pipeline written from scratch in GLSL, weighing only 18KB with zero runtime dependencies.',
      stack: ['TypeScript', 'WebGL2', 'GLSL', 'Custom Math Engine']
    }
  },
  {
    id: 'syeds-analytics-hub',
    title: 'Syed\'s Analytics Hub',
    category: 'Client Project',
    type: 'Engineering',
    year: '2024',
    lead: 'Syed',
    description: 'A high-performance data visualization suite for real-time business intelligence.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Data Analytics', 'Dashboards', 'Real-Time'],
    metrics: 'Sub-10ms render latency',
    status: 'Case Study',
    demoType: 'analytics'
  },
  {
    id: 'hamids-marketplace',
    title: 'Hamid\'s Marketplace',
    category: 'Client Project',
    type: 'Retail',
    year: '2024',
    lead: 'Hamid',
    description: 'Scalable e-commerce architecture for global retail brands.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
    tags: ['Global E-commerce', 'Microservices', 'Scale'],
    metrics: '10M daily API hits',
    status: 'Case Study',
    demoType: 'e-commerce'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'webflow-enterprise',
    title: 'Webflow Enterprise & Hybrid Systems',
    subtitle: 'FIGMA-TO-WEBFLOW ARCHITECTURE',
    description: 'Elite Webflow development featuring Client-First v2 class architecture, complex relational CMS schemas, custom JS/GSAP interaction hooks, and 100/100 Lighthouse performance.',
    badge: 'Flagship Specialization',
    estTime: '2-5 Weeks',
    iconName: 'Globe',
    features: [
      '1:1 Figma to Webflow pixel precision',
      'Client-First v2 class naming architecture',
      'Custom JS, GSAP & Webflow CMS API',
      '100/100 Lighthouse speed & SEO optimization',
      'Lottie & Webflow Interaction physics',
      'Complete team CMS handoff & video guide'
    ]
  },
  {
    id: 'custom-websites',
    title: 'Custom Business Websites',
    subtitle: 'EST. PROJECT / 4-8 WEEKS',
    description: 'Engineered for conversion and reliability. We build bespoke corporate platforms that integrate seamlessly with your existing workflow, ensuring high availability and robust performance.',
    badge: 'Core Service',
    estTime: '4-8 Weeks',
    iconName: 'Code',
    features: [
      'Bespoke React/Next.js frontend',
      'Sub-second page loading speed',
      'SEO & accessibility compliance',
      'CMS integration (Sanity / Contentful)'
    ]
  },
  {
    id: 'portfolio-sites',
    title: 'Portfolio Sites',
    subtitle: 'EDITORIAL-GRADE SHOWROOMS',
    description: 'Editorial-grade digital showrooms for creators, architects, and high-end studios looking to showcase technical prowess and visual identity.',
    badge: 'Popular',
    estTime: '2-4 Weeks',
    iconName: 'Palette',
    features: [
      'High-fashion typographic layouts',
      'Micro-interactions & fluid motion',
      'Custom asset pipeline optimization',
      'Dark/light studio theme presets'
    ]
  },
  {
    id: 'ecommerce-builds',
    title: 'E-commerce Builds',
    subtitle: 'HIGH-CONVERSION STOREFRONTS',
    description: 'High-conversion storefronts focused on speed, security, and user experience with frictionless checkout flows and custom product configurators.',
    estTime: '6-10 Weeks',
    iconName: 'ShoppingCart',
    features: [
      'Headless commerce architecture',
      'Optimistic cart & instant checkout',
      'Multi-currency & localization',
      'Real-time inventory sync'
    ]
  },
  {
    id: 'maintenance-retainers',
    title: 'Maintenance & Retainers',
    subtitle: 'CONTINUOUS CTO-LEVEL SUPPORT',
    description: 'Continuous improvement and security monitoring. We act as your on-call CTO, ensuring your stack is always updated, secure, and optimized.',
    badge: 'Subscription',
    estTime: 'Ongoing',
    iconName: 'ShieldCheck',
    features: [
      '24/7 Security & Uptime Monitoring',
      'Performance Audits & Optimization',
      'Priority Code Support & Hotfixes',
      'Monthly Architectural Reviews'
    ]
  }
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    name: 'Discovery',
    command: '// input_analysis.sh',
    description: 'Deep-dive technical audits and market alignment. We identify bottlenecks and define the technological stack required for your scale.'
  },
  {
    step: '02',
    name: 'Design',
    command: '// figma_to_proto.zip',
    description: 'Translating strategy into high-fidelity blueprints. Architecture diagrams, UI systems, and UX flows focused on conversion and performance.'
  },
  {
    step: '03',
    name: 'Build',
    command: 'git commit -m "feat: core"',
    description: 'Clean, scalable engineering. We write production-ready code with continuous integration and automated testing baked into the core.'
  },
  {
    step: '04',
    name: 'Launch',
    command: 'npm run deploy --prod',
    description: 'Final optimization and seamless deployment. We monitor post-launch performance to ensure zero-downtime scalability.'
  }
];
