// The site's own public copy, from src/app/core/data/site-content.ts on main. Kit screens read it from here
// so the screens say what the site says.

export const SERVICE_AREAS = [
  { id: 'enterprise-software', title: 'Enterprise Software Engineering', summary: 'Custom software designed around your business, from internal operational systems to customer-facing digital platforms.',
    body: 'We build scalable backend services, APIs, business integrations and modern web platforms with strong engineering foundations, clean architecture and long-term maintainability in mind.',
    capabilities: ['Custom software development', 'Web applications and frontend platforms', 'Backend services and APIs', 'Systems integration', 'Enterprise platform modernisation', 'Business process automation', 'SaaS platform development'] },
  { id: 'cloud-infrastructure', title: 'Cloud and Infrastructure Architecture', summary: 'Modern cloud foundations designed for performance, resilience and growth.',
    body: 'We design and implement scalable infrastructure and cloud-native platforms with a strong focus on reliability, automation and operational excellence. From greenfield environments to modernising existing infrastructure, we help teams build cloud ecosystems that are easier to manage, secure and scale.',
    capabilities: ['Cloud architecture and migration', 'Infrastructure design', 'Serverless architecture', 'DevOps and CI/CD automation', 'Cloud environments and deployment pipelines', 'Monitoring and operational tooling', 'Infrastructure reliability and optimisation'] },
  { id: 'crm-customer-experience', title: 'CRM and Customer Experience Platforms', summary: 'Connected customer systems built for service, operations and long-term growth.',
    body: 'We help businesses design and improve customer-facing platforms that connect teams, automate workflows and improve customer engagement across multiple touchpoints.',
    capabilities: ['CRM platforms', 'Customer support platforms', 'Contact centre platforms', 'Workflow automation', 'Customer engagement systems', 'Service operations platforms', 'Platform integrations'] },
  { id: 'ai-automation', title: 'AI, Automation and Digital Experiences', summary: 'Practical AI designed around real business workflows.',
    body: 'We help organisations introduce intelligent automation, AI-enabled workflows and digital products that improve customer engagement and team productivity, while keeping delivery grounded in real-world operations. We also design and build mobile-first experiences that help businesses engage customers wherever they are.',
    capabilities: ['AI-enabled business workflows', 'Intelligent automation', 'Customer support automation', 'Internal productivity tools', 'Mobile applications', 'Digital product design and development', 'Emerging technology adoption'], agentPromo: true },
];

export const PROCESS_STEPS = [
  { title: 'Discovery and strategy', body: 'We start by understanding your business goals, technical landscape and long-term priorities. Every engagement begins with clarity around the problem, architecture and practical outcomes.' },
  { title: 'Architecture and planning', body: 'We define the right technical foundation before building. This includes solution architecture, system planning, infrastructure design and delivery planning, with scalability and maintainability built in from the start.' },
  { title: 'Build and delivery', body: 'We move from architecture into delivery with hands-on engineering and close collaboration. Our focus is practical execution, clean delivery and building technology that works reliably in the real world.' },
  { title: 'Deployment and operations', body: 'We support launch readiness with infrastructure, deployment and operational planning. This includes automation, cloud deployment and creating reliable environments that teams can confidently run and grow.' },
  { title: 'Long-term partnership', body: 'Technology evolves. We continue supporting our partners through optimisation, enhancements, scaling and future roadmap planning as the business grows.' },
];

export const STACK_LAYERS = [
  { id: 'infrastructure', n: '01', label: 'Foundation', title: 'Cloud and infrastructure', service: 'cloud-infrastructure',
    summary: 'The base layer: cloud environments, identity, networking, deployment pipelines and observability. Built for resilience before anything else goes live.' },
  { id: 'data', n: '02', label: 'Data', title: 'Data, CRM and analytics', service: 'crm-customer-experience',
    summary: 'Customer records, operational data and analytics pipelines: connected systems that teams and workflows depend on every day.' },
  { id: 'services', n: '03', label: 'Services', title: 'Services, APIs and integrations', service: 'enterprise-software',
    summary: 'Business logic, APIs and integrations that connect products, teams and third-party systems into one coherent platform.' },
  { id: 'experience', n: '04', label: 'Experience', title: 'Experience, apps and intelligence', service: 'ai-automation',
    summary: 'The surfaces people use: web and mobile applications, customer portals and AI-enabled workflows that sit on top of the stack.' },
];

export const CONTACT_TOPICS = ['A new platform', 'Modernising a system', 'Cloud and infrastructure', 'AI and automation', 'Ongoing engineering', 'Not sure yet'];
export const BLUEPRINT_STARTERS = ['Wholesale marketplace', 'Member portal with AI', 'Fleet operations'];
export const PLATFORM_NAMES = ['Tixxets', 'Fractions', 'Oasis Water', 'FarmAIr'];
export const PARTNER_NAMES = ['Amazon Web Services', 'Google Cloud', 'Microsoft Azure', 'Anthropic', 'OpenAI', 'Stripe', 'Salesforce', 'Intercom', 'Meta', 'LiveKit', 'Vanta'];
