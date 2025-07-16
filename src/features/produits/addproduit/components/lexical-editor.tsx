"use client"

import { useState } from "react"
import type { SerializedEditorState } from "lexical"
import { Editor } from "@/components/blocks/editor-00"

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Décrivez votre produit en détail... Utilisez la barre d'outils pour formater votre texte, ajouter des images et créer du contenu attractif.",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

interface LexicalEditorProps {
  value: SerializedEditorState
  onChange: (value: SerializedEditorState) => void
  placeholder?: string
  className?: string
}

export function LexicalEditor({ value, onChange, placeholder, className }: LexicalEditorProps) {
  return (
    <div className={className}>
      <Editor editorSerializedState={value || initialValue} onSerializedChange={(newValue) => onChange(newValue)} />
    </div>
  )
}

export default function EditorDemo() {
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue)

  return (
    <div>
      <LexicalEditor value={editorState} onChange={setEditorState} placeholder="Décrivez votre produit..." />
    </div>
  )
}
