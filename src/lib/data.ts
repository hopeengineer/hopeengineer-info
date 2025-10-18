
import { Facebook, Instagram, AtSign, Inbox } from "lucide-react";
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

// Helper function to find an image by its ID
const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (image) {
    return image;
  }
  // Return a fallback image if no image is found
  return {
    id: 'fallback',
    description: 'A fallback image',
    imageUrl: `https://picsum.photos/seed/fallback/600/400`,
    imageHint: 'abstract',
  };
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/ai-apps", label: "AI Apps" },
  { href: "/about", label: "About" },
];

export const SOCIAL_LINKS = [
  { name: "Threads", href: "#", icon: AtSign },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Facebook", href: "#", icon: Facebook },
];

export const blogPosts = [
  {
    slug: "the-rise-of-ai-in-modern-engineering",
    title: "The Rise of AI in Modern Engineering",
    description: "Exploring how artificial intelligence is reshaping the engineering landscape, from design to deployment.",
    date: "July 22, 2024",
    author: "HopeEngineer",
    image: getImage('blog-1'),
    content: `
      <p>Artificial Intelligence (AI) is no longer a concept confined to science fiction. It's a transformative force that's reshaping industries, and engineering is at the forefront of this revolution. From automating complex design processes to optimizing manufacturing lines, AI is unlocking new levels of efficiency and innovation.</p>
      <h3 class="font-headline text-2xl font-bold my-4">AI in Design and Simulation</h3>
      <p>One of the most significant impacts of AI is in the realm of generative design. Engineers can now input specific constraints and goals, and AI algorithms can generate thousands of potential design solutions. This not only accelerates the design process but also leads to more optimized and lightweight structures that a human might not have conceived.</p>
      <p>Simulations are also becoming smarter. AI-powered tools can predict failure points, analyze fluid dynamics, and simulate real-world conditions with greater accuracy and speed, reducing the need for costly physical prototypes.</p>
      <h3 class="font-headline text-2xl font-bold my-4">The Future is Collaborative</h3>
      <p>The future isn't about AI replacing engineers, but rather augmenting their abilities. The collaboration between human creativity and AI's computational power will drive the next wave of engineering breakthroughs. As we move forward, the ability to work alongside AI systems will become an essential skill for every engineer.</p>
    `
  },
  {
    slug: "principles-of-scalable-software-architecture",
    title: "Principles of Scalable Software Architecture",
    description: "A deep dive into the core principles that enable software to grow and handle increasing loads.",
    date: "July 15, 2024",
    author: "HopeEngineer",
    image: getImage('blog-2'),
    content: `
      <p>Scalability is a critical attribute of modern software systems. As user bases grow and data volumes explode, an application's ability to handle the increased load gracefully is paramount. This post delves into the fundamental principles of building scalable software architecture.</p>
      <h3 class="font-headline text-2xl font-bold my-4">Decoupling and Microservices</h3>
      <p>Monolithic architectures, where all components are tightly integrated, are notoriously difficult to scale. A key principle is to decouple components into smaller, independent services, often called microservices. Each service can be scaled independently based on its specific needs, leading to more efficient resource utilization.</p>
      <h3 class="font-headline text-2xl font-bold my-4">Asynchronous Communication</h3>
      <p>Switching from synchronous to asynchronous communication patterns is another cornerstone of scalability. Using message queues and event-driven architectures allows services to communicate without waiting for a direct response, preventing bottlenecks and improving system resilience.</p>
    `
  },
  {
    slug: "a-framework-for-continuous-personal-growth",
    title: "A Framework for Continuous Personal Growth",
    description: "How to apply engineering principles to your own personal and professional development.",
    date: "July 8, 2024",
    author: "HopeEngineer",
    image: getImage('blog-3'),
    content: `
      <p>The same principles that we use to build robust and scalable systems can be applied to our own lives for continuous personal growth. Think of your life as a system that you can iteratively improve.</p>
      <h3 class="font-headline text-2xl font-bold my-4">Define Your Metrics</h3>
      <p>What does "success" or "growth" mean to you? Just as in engineering, you can't improve what you can't measure. Define clear metrics for different areas of your life: health, career, relationships, and skills. This could be anything from "read 20 books a year" to "run a 5k in under 25 minutes."</p>
      <h3 class="font-headline text-2xl font-bold my-4">Iterate and Refactor</h3>
      <p>Your life isn't a single project with a final deadline. It's a continuous process of iteration. Regularly review your progress against your metrics (your "sprint review"). What's working? What's not? Don't be afraid to "refactor" your habits and routines to be more efficient and aligned with your goals.</p>
    `
  },
  {
    slug: "mastering-productivity-tools-for-engineers",
    title: "Mastering Productivity: Tools for Engineers",
    description: "A look at the essential tools and techniques to boost your productivity as an engineer.",
    date: "July 1, 2024",
    author: "HopeEngineer",
    image: getImage('blog-4'),
    content: `
      <p>In the fast-paced world of engineering, productivity is key. Leveraging the right tools and techniques can make a significant difference in your output and reduce stress. This article explores some of the must-have productivity enhancers for engineers.</p>
      <h3 class="font-headline text-2xl font-bold my-4">Code Editors and IDEs</h3>
      <p>Your primary tool is your code editor or Integrated Development Environment (IDE). Mastering it is non-negotiable. Learn the keyboard shortcuts, install useful extensions for linting and formatting, and configure it to your workflow. Tools like VS Code, JetBrains IDEs, or Neovim are powerful allies.</p>
      <h3 class="font-headline text-2xl font-bold my-4">Task and Knowledge Management</h3>
      <p>Keeping track of tasks and knowledge is crucial. Tools like Notion, Obsidian, or even a simple text file can help you organize your thoughts, document processes, and manage your to-do list. The key is to find a system that works for you and stick to it.</p>
    `
  }
];

export const services = [
  {
    title: "1-on-1 Sessions",
    tagline: "Your vision, amplified with human-first strategy.",
    description: [
      "This is a 1-on-1 deep dive to design your personal system for growth. We'll engineer a clear, authentic, and powerful plan for your content, growth, and monetization.",
      "✓ Personalized Threads & Content Strategy",
      "✓ Authentic Monetization Framework",
      "✓ Radical Clarity & Actionable Steps",
    ],
    image: getImage('service-sessions'),
  },
  {
    title: "Full Circle ⭕",
    description: "Join a thriving community of like-minded engineers and creators for collaborative learning and growth.",
    image: getImage('service-community'),
  },
  {
    title: "AI Content Automation",
    description: "Leverage the power of AI to automate your content creation, from blog posts to social media updates.",
    image: getImage('service-automation'),
  },
];

export const aiApps = [
  {
    title: "AI Idea Generator",
    description: "Stuck in a rut? Generate innovative ideas for your next project, blog post, or business venture.",
    image: getImage('ai-app-1'),
    href: "#"
  },
  {
    title: "Automated Code Documenter",
    description: "Automatically generate clear and concise documentation for your codebases, saving you hours of work.",
    image: getImage('ai-app-2'),
    href: "#"
  },
  {
    title: "Social Media Post Crafter",
    description: "Create engaging and platform-optimized social media posts in seconds with our AI-powered writer.",
    image: getImage('ai-app-3'),
    href: "#"
  },
  {
    title: "Personalized Learning Path AI",
    description: "Get a custom-tailored learning path to acquire new skills, complete with resources and project ideas.",
    image: getImage('ai-app-4'),
    href: "#"
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Client A",
    text: "Working with HopeEngineer was a game-changer for my career.",
    image: getImage('testimonial-1'),
  },
  {
    id: 2,
    name: "Client B",
    text: "The insights from the 1-on-1 sessions were invaluable. Highly recommended!",
    image: getImage('testimonial-2'),
  },
  {
    id: 3,
    name: "Client C",
    text: "The AI automation service saved me countless hours. It's like having a superpower.",
    image: getImage('testimonial-3'),
  },
];
