// Enhanced Sitemap Generator for AskHire
// This should be used in your build process or backend

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export interface SitemapIndex {
  loc: string;
  lastmod?: string;
}

class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];

  constructor(baseUrl: string = 'https://askhire.in') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // Add a URL to the sitemap
  addUrl(urlData: SitemapUrl): void {
    this.urls.push({
      ...urlData,
      loc: this.normalizeUrl(urlData.loc)
    });
  }

  // Add static pages
  addStaticPages(): void {
    const staticPages: SitemapUrl[] = [
      {
        loc: '/',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: '/jobs',
        lastmod: new Date().toISOString(),
        changefreq: 'hourly',
        priority: 0.9
      },
      {
        loc: '/about',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: '/contact',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: '/privacy-policy',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.3
      },
      {
        loc: '/terms-of-service',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.3
      },
      {
        loc: '/register',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: '/login',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.5
      }
    ];

    staticPages.forEach(page => this.addUrl(page));
  }

  // Add job listings (would be called with actual job data)
  addJobListings(jobs: Array<{
    id: number;
    job_title: string;
    company_name: string;
    post_date: string;
    updated_at?: string;
    company_logo?: string;
  }>): void {
    jobs.forEach(job => {
      const jobSlug = this.generateJobSlug(job.job_title, job.company_name);
      
      this.addUrl({
        loc: `/job/${job.id}/${jobSlug}`,
        lastmod: job.updated_at || job.post_date,
        changefreq: 'weekly',
        priority: 0.8,
        images: job.company_logo ? [{
          loc: job.company_logo,
          title: `${job.company_name} logo`,
          caption: `Company logo for ${job.company_name}`
        }] : undefined
      });
    });
  }

  // Add company pages
  addCompanyPages(companies: Array<{
    id: number;
    name: string;
    updated_at?: string;
    logo?: string;
  }>): void {
    companies.forEach(company => {
      const companySlug = this.generateSlug(company.name);
      
      this.addUrl({
        loc: `/company/${company.id}/${companySlug}`,
        lastmod: company.updated_at || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
        images: company.logo ? [{
          loc: company.logo,
          title: `${company.name} company page`,
          caption: `Jobs and career opportunities at ${company.name}`
        }] : undefined
      });
    });
  }

  // Add category pages
  addCategoryPages(): void {
    const categories = [
      'software-engineer',
      'data-scientist', 
      'product-manager',
      'designer',
      'marketing',
      'sales',
      'finance',
      'operations'
    ];

    const locations = [
      'bengaluru',
      'mumbai',
      'delhi',
      'hyderabad',
      'chennai',
      'pune'
    ];

    // Add category pages
    categories.forEach(category => {
      this.addUrl({
        loc: `/jobs?category=${category}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8
      });
    });

    // Add location pages
    locations.forEach(location => {
      this.addUrl({
        loc: `/jobs?location=${location}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8
      });
    });

    // Add combination pages (category + location)
    categories.slice(0, 3).forEach(category => {
      locations.slice(0, 3).forEach(location => {
        this.addUrl({
          loc: `/jobs?category=${category}&location=${location}`,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.7
        });
      });
    });
  }

  // Generate main sitemap XML
  generateSitemap(): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    const urls = this.urls.map(url => this.generateUrlXml(url)).join('\n');
    
    const urlsetClose = '</urlset>';
    
    return xmlHeader + urlsetOpen + urls + urlsetClose;
  }

  // Generate sitemap index XML
  generateSitemapIndex(sitemaps: SitemapIndex[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const sitemapEntries = sitemaps.map(sitemap => 
      `  <sitemap>\n    <loc>${this.normalizeUrl(sitemap.loc)}</loc>\n` +
      (sitemap.lastmod ? `    <lastmod>${sitemap.lastmod}</lastmod>\n` : '') +
      '  </sitemap>'
    ).join('\n');
    
    const sitemapIndexClose = '\n</sitemapindex>';
    
    return xmlHeader + sitemapIndexOpen + sitemapEntries + sitemapIndexClose;
  }

  // Generate individual URL XML
  private generateUrlXml(url: SitemapUrl): string {
    let xml = '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    
    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }

    // Add image information
    if (url.images && url.images.length > 0) {
      url.images.forEach(image => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${this.normalizeUrl(image.loc)}</image:loc>\n`;
        if (image.title) {
          xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
        }
        if (image.caption) {
          xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
        }
        xml += '    </image:image>\n';
      });
    }

    // Add alternate language links
    if (url.alternates && url.alternates.length > 0) {
      url.alternates.forEach(alternate => {
        xml += `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />\n`;
      });
    }
    
    xml += '  </url>';
    
    return xml;
  }

  // Utility methods
  private normalizeUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  }

  private generateJobSlug(jobTitle: string, companyName: string): string {
    const titleSlug = this.generateSlug(jobTitle);
    const companySlug = this.generateSlug(companyName);
    return `${titleSlug}-at-${companySlug}`;
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Get all URLs (for debugging)
  getUrls(): SitemapUrl[] {
    return this.urls;
  }

  // Clear all URLs
  clear(): void {
    this.urls = [];
  }
}

// Usage example and export functions
export const generateMainSitemap = async (): Promise<string> => {
  const generator = new SitemapGenerator();
  
  // Add static pages
  generator.addStaticPages();
  
  // Add category and location pages
  generator.addCategoryPages();
  
  // In a real implementation, you would fetch this data from your API/database
  // const jobs = await fetchJobs();
  // generator.addJobListings(jobs);
  
  // const companies = await fetchCompanies();
  // generator.addCompanyPages(companies);
  
  return generator.generateSitemap();
};

export const generateSitemapIndex = (): string => {
  const generator = new SitemapGenerator();
  
  const sitemaps: SitemapIndex[] = [
    {
      loc: '/sitemap.xml',
      lastmod: new Date().toISOString()
    },
    {
      loc: '/sitemap-jobs.xml', 
      lastmod: new Date().toISOString()
    },
    {
      loc: '/sitemap-companies.xml',
      lastmod: new Date().toISOString()
    }
  ];
  
  return generator.generateSitemapIndex(sitemaps);
};

export const generateJobsSitemap = async (jobs: any[]): Promise<string> => {
  const generator = new SitemapGenerator();
  generator.addJobListings(jobs);
  return generator.generateSitemap();
};

export const generateCompaniesSitemap = async (companies: any[]): Promise<string> => {
  const generator = new SitemapGenerator();
  generator.addCompanyPages(companies);
  return generator.generateSitemap();
};

// Save sitemaps to public directory (for build process)
export const saveSitemapsToPublic = async (): Promise<void> => {
  // This would be implemented in your build process
  // You would write the generated XML to public/sitemap.xml etc.
  
  try {
    const mainSitemap = await generateMainSitemap();
    const sitemapIndex = generateSitemapIndex();
    
    // In Node.js environment:
    // await fs.writeFile('public/sitemap.xml', mainSitemap);
    // await fs.writeFile('public/sitemap-index.xml', sitemapIndex);
    
    console.log('Sitemaps generated successfully');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
  }
};

export default SitemapGenerator;