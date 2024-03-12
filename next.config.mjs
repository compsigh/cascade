// @ts-check
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

const vercelTheme = await fetch(
  'https://raw.githubusercontent.com/triyanox/vercel-theme/b93488a9a13216371ccdf015f3dc9f736dacb3e2/themes/Vercel%20Theme-color-theme.json'
)
const vercelThemeJson = await vercelTheme.json()

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: vercelThemeJson,
  defaultLang: 'plaintext'
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [[rehypePrettyCode, options]]
  }
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true
}

export default withMDX(nextConfig)
