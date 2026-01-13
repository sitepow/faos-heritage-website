/* eslint-disable react/no-unstable-nested-components */
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
import { useEffect, useState, type ComponentProps } from 'react'

import { useDebouncedChange } from '@/hooks/useDebouncedChange'
import { cn } from '@/utils/style'

type Props = Omit<ComponentProps<typeof MDXEditor>, 'markdown' | 'onChange'> & {
  value: string
  onChange: (md: string) => void
}

export function MdEditorCustomize({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: Props) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedChange = useDebouncedChange(onChange, 500)

  useEffect(() => {
    setLocalValue(value)
  }, [value])
  return (
    <MDXEditor
      {...props}
      placeholder={`(${placeholder})`}
      className={cn(
        'border-divider dark-theme dark-editor col-span-2 rounded-xl border',
        className,
      )}
      markdown={localValue}
      onChange={(val) => {
        setLocalValue(val)
        debouncedChange(val)
      }}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
            </>
          ),
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        tablePlugin(),
        imagePlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  )
}
