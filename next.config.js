const isProd = process.env.NODE_ENV === 'production';
const repoName = 'Sudoko-solver';

export default {
  output: 'export',
  distDir: 'docs',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
