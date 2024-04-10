import { Client, isFullBlock } from '@notionhq/client'

export async function fetchRiddleParts() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const pageId = process.env.NOTION_PAGE_ID as string
  const pageContent = await notion.blocks.children.list({ block_id: pageId })

  const riddleParts: string[] = []
  for (const block of pageContent.results)
    if (isFullBlock(block) && block.type === 'code')
      riddleParts.push(block.code.rich_text[0]?.plain_text)

  return riddleParts
}
