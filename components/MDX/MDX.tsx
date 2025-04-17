import { Frontmatter } from "@/app/riddles/[riddleNumber]/page";

export type PostProps = {
  content: React.ReactElement;
  frontmatter: Frontmatter;
};

export function MDX({ content }: PostProps) {
  return (
    <>
      <article>{content}</article>
    </>
  );
}
