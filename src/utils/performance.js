// Add image optimization and lazy loading config
const imageConfig = {
  domains: ['taarifasuites.com'],
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96],
  loader: 'default',
  path: '/_next/image',
  minimumCacheTTL: 60
};

export default imageConfig; 