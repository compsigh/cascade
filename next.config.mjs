// @ts-check
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

const withMDX = createMDX({
  options: {
    rehypePlugins: [rehypePrettyCode]
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
