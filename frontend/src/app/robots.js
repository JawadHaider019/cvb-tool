export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/admin/'],
    },
    sitemap: 'https://selbstfahrervermietversicherung.online/sitemap.xml',
  };
}

