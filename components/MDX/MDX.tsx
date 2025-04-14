import { PostProps } from "@/app/[...slug]/page";

export function MDX({ content }: PostProps) {
  return (
    <>
      <article>{content}</article>
    </>
  );
}
