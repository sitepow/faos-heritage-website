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
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { markdownShortcutPlugin, tablePlugin } from '@mdxeditor/editor'
import { useEffect, useMemo, useState, type ComponentProps } from 'react'

import { useDebouncedChange } from '@/hooks/useDebouncedChange'
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
    <BlockTypeSelect />
    <BoldItalicUnderlineToggles />
    <ListsToggle />
    <CreateLink />
    <InsertImage />
    <InsertTable />
    <InsertThematicBreak />
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
      imagePlugin(),
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
  const [localValue, setLocalValue] = useState(value)
  const debouncedChange = useDebouncedChange(onChange, 500)
  const plugins = useEditorPlugins()

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (markdown: string) => {
    setLocalValue(markdown)
    debouncedChange(markdown)
  }

  return (
    <MDXEditor
      {...props}
      className={cn(
        'border-default-100 dark-theme dark-editor col-span-2 rounded-xl border',
        className,
      )}
      markdown={localValue}
      placeholder={placeholder ? `(${placeholder})` : undefined}
      plugins={plugins}
      onChange={handleChange}
    />
  )
}

export { MdEditorCustomize }
