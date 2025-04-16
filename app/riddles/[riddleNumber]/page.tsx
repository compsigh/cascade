import { Input } from "@/components/Input";
import { MDX } from "@/components/MDX";
import { Spacer } from "@/components/Spacer";
import { getRiddle } from "@/functions/db";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import rehypePrettyCode, { Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ riddleNumber: string }>;
};

export type Frontmatter = {
  title: string;
  description: string;
  slug?: string;
};

async function readMarkdownFileAtRoute(page: string) {
  const rehypePrettyCodeOptions: Options = {
    theme: "github-light",
  };

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: page,
    components: { Input, Link, Spacer },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, rehypePrettyCodeOptions],
          rehypeSlug,
        ],
      },
    },
  });
  return { content, frontmatter };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const riddleNumber = Number(params.riddleNumber);
  if (isNaN(riddleNumber)) return notFound();
  const riddle = await getRiddle(riddleNumber);
  //TODO: route back to riddles
  if (riddle === null) return;

  const { content, frontmatter } = await readMarkdownFileAtRoute(riddle.text);

  return (
    <>
      <Suspense>
        <MDX content={content} frontmatter={frontmatter} />
      </Suspense>
    </>
  );
}
