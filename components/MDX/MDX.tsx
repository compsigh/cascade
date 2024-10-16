import { PostProps } from '@/app/[...slug]/page'

import { Breadcrumbs } from '@/components/Breadcrumbs'

export function MDX({ content }: PostProps) {
  return (
    <>
      <Breadcrumbs />
      <article>
        {content}
      </article>
    </>
  )
}
