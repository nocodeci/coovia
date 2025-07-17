"use client"

import { useState } from "react"
import { type InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { ParagraphNode, TextNode } from "lexical"
import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { editorTheme } from "./themes/editor-theme"
import { ToolbarPlugin } from "./plugins/toolbar/toolbar-plugin"
import { BlockFormatDropDown } from "./plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "./plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "./plugins/toolbar/block-format/format-check-list"
import { FormatHeading } from "./plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "./plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "./plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "./plugins/toolbar/block-format/format-quote"
import { FontFormatToolbarPlugin } from "./plugins/toolbar/font-format-toolbar-plugin"
import { FontSizeToolbarPlugin } from "./plugins/toolbar/font-size-toolbar-plugin"
import { FontColorToolbarPlugin } from "./plugins/toolbar/font-color-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from "./plugins/toolbar/font-background-toolbar-plugin"
import { HistoryToolbarPlugin } from "./plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "./plugins/toolbar/link-toolbar-plugin"
import { SubSuperToolbarPlugin } from "./plugins/toolbar/subsuper-toolbar-plugin"
import { ClearFormattingToolbarPlugin } from "./plugins/toolbar/clear-formatting-toolbar-plugin"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

const editorConfig: InitialConfigType = {
  namespace: "RichTextEditor",
  theme: editorTheme,
  nodes: [HeadingNode, ParagraphNode, TextNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  onError: (error: Error) => {
    console.error(error)
  },
}

interface RichTextEditorProps {
  placeholder?: string
  className?: string
  onChange?: (html: string) => void
}

export function RichTextEditor({ placeholder = "Commencez à écrire...", className, onChange }: RichTextEditorProps) {
  return (
    <div className={`bg-background w-full overflow-hidden rounded-lg border ${className}`}>
      <LexicalComposer initialConfig={editorConfig}>
        <TooltipProvider>
          <EditorPlugins placeholder={placeholder} onChange={onChange} />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}

interface EditorPluginsProps {
  placeholder: string
  onChange?: (html: string) => void
}

function EditorPlugins({ placeholder, onChange }: EditorPluginsProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* Comprehensive Toolbar */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 overflow-auto border-b p-2 bg-muted/30">
            {/* History */}
            <HistoryToolbarPlugin />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Block Format */}
            <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
          </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Font Size */}
            <FontSizeToolbarPlugin />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <FontFormatToolbarPlugin format="bold" />
              <FontFormatToolbarPlugin format="italic" />
              <FontFormatToolbarPlugin format="underline" />
              <FontFormatToolbarPlugin format="strikethrough" />
              <FontFormatToolbarPlugin format="code" />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Colors */}
            <div className="flex items-center gap-1">
              <FontColorToolbarPlugin />
              <FontBackgroundToolbarPlugin />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Sub/Super script */}
            <SubSuperToolbarPlugin />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Link */}
            <LinkToolbarPlugin />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Clear Formatting */}
            <ClearFormattingToolbarPlugin />
          </div>
        )}
      </ToolbarPlugin>

      {/* Editor */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="relative">
              <div ref={onRef}>
                <ContentEditable placeholder={placeholder} className="min-h-[300px] max-h-[600px] overflow-y-auto" />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* Plugins */}
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        <ClickableLinkPlugin />
        <TabIndentationPlugin />
      </div>

      {/* Quick suggestions */}
      <div className="p-3 border-t bg-muted/20">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="font-medium text-muted-foreground">Suggestions rapides:</span>
          <button className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded">Points clés</button>
          <button className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded">Liste de fonctionnalités</button>
          <button className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded">Citation</button>
          <button className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded">Tableau</button>
        </div>
      </div>
    </div>
  )
}
