import { auth } from "@/auth"
import { get } from "@vercel/edge-config"
import { compileMDX } from "next-mdx-remote/rsc"
import { getRiddle } from "@/functions/db/riddles"
import { notFound, redirect } from "next/navigation"
import { getTeamByParticipantEmail } from "@/functions/db/teams"
import { isAuthed, isOrganizer } from "@/functions/user-management"

import Link from "next/link"
import { Suspense } from "react"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import { MDX } from "@/components/MDX"
import { Input } from "@/components/Input"
import { Spacer } from "@/components/Spacer"
import { DownloadInput } from "@/components/DownloadInput"
import rehypePrettyCode, { Options } from "rehype-pretty-code"

type Props = {
  params: Promise<{ riddleNumber: string }>
}

export type Frontmatter = {
  title: string
  description: string
  slug?: string
}

async function readMarkdownFileAtRoute(page: string) {
  const rehypePrettyCodeOptions: Options = {
    theme: "github-light"
  }

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: page,
    components: { Input, Link, Spacer },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], rehypeSlug]
      }
    }
  })
  return { content, frontmatter }
}

export default async function Page(props: Props) {
  const session = await auth()
  const authed = isAuthed(session)
  if (!session || !authed) redirect("/")
  const eventStarted = (await get("eventStarted")) as boolean
  if (!eventStarted && !isOrganizer(session)) redirect("/")

  const params = await props.params
  const riddleNumber = Number(params.riddleNumber)
  if (isNaN(riddleNumber)) return notFound()
  const riddle = await getRiddle(riddleNumber)
  if (riddle === null) return notFound()
  const team = await getTeamByParticipantEmail(session.user!.email!)

  const { content, frontmatter } = await readMarkdownFileAtRoute(riddle.text)

  return (
    <>
      <Suspense>
        <MDX content={content} frontmatter={frontmatter} />
      </Suspense>
      <DownloadInput riddleNumber={riddleNumber} input={riddle.input} />
      <Spacer size={15} />
      <Input riddleNumber={riddleNumber} teamId={team!.id} />
    </>
  )
}
