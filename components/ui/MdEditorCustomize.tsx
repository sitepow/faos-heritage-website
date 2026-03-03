/* eslint-disable no-unused-vars */
'use client'

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  diffSourcePlugin,
  UndoRedo,
  Separator,
  InsertCodeBlock,
  InsertAdmonition,
  type MDXEditorMethods,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useTheme } from 'next-themes'
import { useMemo, useRef, type ComponentProps } from 'react'

import { cn } from '@/utils/style'

type MdEditorProps = Omit<
  ComponentProps<typeof MDXEditor>,
  'markdown' | 'onChange'
> & {
  value: string
  onChange: (markdown: string) => void
}

const ToolbarContents = () => (
  <>
    <UndoRedo />
    <Separator />
    <BlockTypeSelect />
    <BoldItalicUnderlineToggles />
    <Separator />
    <ListsToggle />
    <Separator />
    <CreateLink />
    <InsertImage />
    <Separator />
    <InsertTable />
    <InsertThematicBreak />
    <Separator />
    <InsertCodeBlock />
    <InsertAdmonition />
  </>
)

const useEditorPlugins = () =>
  useMemo(
    () => [
      toolbarPlugin({
        toolbarContents: ToolbarContents,
      }),
      headingsPlugin({ allowedHeadingLevels: [2, 3, 4, 5, 6] }),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      linkPlugin(),
      tablePlugin(),
      imagePlugin({
        imageUploadHandler: async (image: File) => {
          return URL.createObjectURL(image)
        },
      }),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          js: 'JavaScript',
          css: 'CSS',
          html: 'HTML',
          tsx: 'TypeScript',
          prisma: 'Prisma',
          sql: 'SQL',
        },
      }),
      directivesPlugin({
        directiveDescriptors: [AdmonitionDirectiveDescriptor],
      }),
      frontmatterPlugin(),
      diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'initial' }),
      markdownShortcutPlugin(),
    ],
    [],
  )

const MdEditorCustomize = ({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: MdEditorProps) => {
  const { theme } = useTheme()
  const plugins = useEditorPlugins()
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleChange = (markdown: string) => {
    onChange(markdown)
  }

  return (
    <MDXEditor
      {...props}
      ref={editorRef}
      className={cn(
        'border-default-100 w-full rounded-xl border transition-colors',
        theme === 'dark' ? 'dark-editor' : 'light-editor',
        className,
      )}
      markdown={value}
      placeholder={
        placeholder ? `(${placeholder})` : 'เริ่มเขียนเนื้อหาของคุณ...'
      }
      plugins={plugins}
      onChange={handleChange}
    />
  )
}

export { MdEditorCustomize }
