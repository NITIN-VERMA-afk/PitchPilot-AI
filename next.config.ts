/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: { resolve: { alias: any; fallback: any; }; }, { isServer }: any) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    
    // Handle pdf-parse dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  },
 
  webpack5: true,
};

module.exports = nextConfig;
