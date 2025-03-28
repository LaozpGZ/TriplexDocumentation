import bundleAnalyzer from '@next/bundle-analyzer'
import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  latex: true,
  contentDirBasePath: '/',
  staticImage: true
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = withBundleAnalyzer(
  withNextra({
    reactStrictMode: true,
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    i18n: {
      locales: ['en', 'zh-SG'],
      defaultLocale: 'en'
    },
    redirects: async () => [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        statusCode: 302
      }
    ],
    rewrites: async () => [
      {
        source: '/en/android-chrome-192x192.png',
        destination: '/android-chrome-192x192.png'
      },
      {
        source: '/en/android-chrome-512x512.png',
        destination: '/android-chrome-512x512.png'
      },
      {
        source: '/zh-SG/android-chrome-192x192.png',
        destination: '/android-chrome-192x192.png'
      },
      {
        source: '/zh-SG/android-chrome-512x512.png',
        destination: '/android-chrome-512x512.png'
      },
      {
        source: '/en/favicon/:path*',
        destination: '/favicon/:path*'
      },
      {
        source: '/zh-SG/favicon/:path*',
        destination: '/favicon/:path*'
      }
    ],
    webpack(config) {
      // rule.exclude doesn't work starting from Next.js 15
      const { test: _test, ...imageLoaderOptions } = config.module.rules.find(
        rule => rule.test?.test?.('.svg')
      )
      config.module.rules.push({
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /svgr/,
            use: ['@svgr/webpack']
          },
          imageLoaderOptions
        ]
      })
      return config
    },
    experimental: {
      turbo: {
        rules: {
          './app/_icons/*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js'
          }
        }
      },
      optimizePackageImports: [
        // '@app/_icons'
      ]
    }
  })
)

export default nextConfig
