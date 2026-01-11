/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
'use client'

import {
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  toolbarPlugin,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  tablePlugin,
  imagePlugin,
} from '@mdxeditor/editor'

import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

type Props = Omit<ComponentProps<typeof MDXEditor>, 'markdown' | 'onChange'> & {
  value: string
  onChange: (md: string) => void
}

export function MdEditorCustomize({
  value,
  onChange,
  className,
  ...props
}: Props) {
  return (
    <MDXEditor
      {...props}
      className={cn(
        'border-divider col-span-2 min-h-[250px] rounded-xl border',
        className,
      )}
      markdown={value}
      onChange={onChange}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {/* <BlockTypeSelect /> */}
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
