import path from 'node:path'
import Link from 'next/link'
import { Suspense } from 'react'
import fs from 'node:fs/promises'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'

import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode, { type Options } from 'rehype-pretty-code'

import { MDX } from '@/components/MDX'
import { Spacer } from '@/components/Spacer'

export type Frontmatter = {
  title: string
  description: string
  slug?: string
}

export type PostProps = {
  content: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  frontmatter: Frontmatter
}

/**
 * Given a route served by the Next.js App Router, read the Markdown file associated with the route.
 *
 * @param {string[]} segments - A route served by the Next.js App Router. The last element in the array is the filename, and each preceding element is a parent directory.
 * @example readMarkdownFileAtRoute(['docs', 'about']) // Reads `app/docs/about.md`
 */
export async function readMarkdownFileAtRoute(segments: string[]) {
  try {
    const filePath = path.join(process.cwd(), 'app', ...segments) + '.md'
    const page = await fs.readFile(filePath, 'utf8')

    const rehypePrettyCodeOptions: Options = {
      theme: 'github-light'
    }

    const { content, frontmatter } = await compileMDX<Frontmatter>({
      source: page,
      components: { Link, Spacer },
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [rehypePrettyCode, rehypePrettyCodeOptions],
            rehypeSlug
          ]
        }
      }
    })
    return { content, frontmatter }
  } catch (error) {
    // If a Markdown file does not exist at the route provided, it's possible the route is a slug alias
    // For each Markdown file, read it and compare its frontmatter `slug` to the route provided
    if ((error as any).code === 'ENOENT') {
      const slugs = await generateUnmodifiedSlugsFromMarkdownFiles('app')
      for (const { slug } of slugs) {
        const { frontmatter } = await readMarkdownFileAtRoute(slug)
        if (frontmatter.slug === segments.join('/'))
          return readMarkdownFileAtRoute(slug)
      }
    }
    notFound()
  }
}

export async function generateMetadata(
  { params }:
  { params: { slug: string[] } }
) {
  const { frontmatter } = await readMarkdownFileAtRoute(params.slug)
  const metadata: Metadata = {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      siteName: 'compsigh cascade',
      images: '/public/og-image.png'
    }
  }

  return metadata
}

/**
 * Recursively generate a list of slugs for Next.js' `generateStaticParams()` from all Markdown files in a folder and its subfolders. The slugs are relative to the `app/` directory. Does not modify the slug regardless of frontmatter; that is done in `generateStaticParams()`.
 *
 * @param {string} folder - The folder from where to scan for Markdown files.
 * @example generateUnmodifiedSlugsFromMarkdownFiles('app') // Returns [{ slug: ['docs', '01-about'] }, { slug: ['docs', '02-values'] }, ...]
 */
export async function generateUnmodifiedSlugsFromMarkdownFiles(folder: string) {
  const folderContents = await fs.readdir(folder, { withFileTypes: true })
  const files = folderContents.filter((file) => file.isFile())
  const directories = folderContents.filter((file) => file.isDirectory())
  let slugs = files
    .filter((file) => file.name.endsWith('.md'))
    .map((file) => file.name.replace(/\.md$/, ''))
    .map((slug) => path.join(folder, slug))
    .map((slug) => slug.split('/'))
    .map((slug) => slug.slice(1))
    .map((slug) => ({ slug }))

  for (const directory of directories) {
    const nestedSlugs = await generateUnmodifiedSlugsFromMarkdownFiles(path.join(folder, directory.name))
    slugs = slugs.concat(nestedSlugs)
  }

  return slugs
}

export const dynamicParams = false
export async function generateStaticParams() {
  let slugs = await generateUnmodifiedSlugsFromMarkdownFiles('app')

  // For each file:
  // 1. Read it
  // 2. Parse its Markdown frontmatter
  // 3. Determine if it has a `slug` key
  // 4. If it does, replace the entry in `slugs` with the new slug
  for (const [index, { slug: route }] of slugs.entries()) {
    const { frontmatter } = await readMarkdownFileAtRoute(route)
    if (frontmatter.slug)
      slugs[index] = { slug: frontmatter.slug.split('/') }
  }
  return slugs
}

export default async function Page(
  { params }:
  { params: { slug: string[] } }
) {
  const { content, frontmatter } = await readMarkdownFileAtRoute(params.slug)
  return (
    <>
      <Suspense>
        <MDX content={content} frontmatter={frontmatter} />
        <Spacer size="20vh" />
      </Suspense>
    </>
  )
}
