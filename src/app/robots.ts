import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hopeengineer.info';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin', 
        '/blog/create', 
        '/blog/*/edit', 
        '/login', 
        '/signup'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
