import path from 'node:path';
import fs from 'node:fs/promises';

async function getRoadmapIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/roadmaps'));
}

async function getBestPracticesIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/best-practices'));
}

export function shouldIndexPage(pageUrl) {
  return ![
    'https://stemdo-roadmap.io/404',
    'https://stemdo-roadmap.io/terms',
    'https://stemdo-roadmap.io/privacy',
    'https://stemdo-roadmap.io/pdfs',
    'https://stemdo-roadmap.io/g',
  ].includes(pageUrl);
}

export async function serializeSitemap(item) {
  const highPriorityPages = [
    'https://stemdo-roadmap.io',
    'https://stemdo-roadmap.io/about',
    'https://stemdo-roadmap.io/roadmaps',
    'https://stemdo-roadmap.io/best-practices',
    'https://stemdo-roadmap.io/guides',
    'https://stemdo-roadmap.io/videos',
    ...(await getRoadmapIds()).flatMap((id) => [
      `https://stemdo-roadmap.io/${id}`,
      `https://stemdo-roadmap.io/${id}/topics`,
    ]),
    ...(await getBestPracticesIds()).map(
      (id) => `https://stemdo-roadmap.io/best-practices/${id}`
    ),
  ];

  // Roadmaps and other high priority pages
  for (let pageUrl of highPriorityPages) {
    if (item.url === pageUrl) {
      return {
        ...item,
        // @ts-ignore
        changefreq: 'monthly',
        priority: 1,
      };
    }
  }

  // Guide and video pages
  if (
    item.url.startsWith('https://stemdo-roadmap.io/guides') ||
    item.url.startsWith('https://stemdo-roadmap.io/videos')
  ) {
    return {
      ...item,
      // @ts-ignore
      changefreq: 'monthly',
      priority: 0.9,
    };
  }

  return undefined;
}
