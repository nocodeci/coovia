"use client"
import { Editor } from "primereact/editor"

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Décrivez votre produit en détail...",
  className,
}: RichTextEditorProps) {
  const handleTextChange = (e: any) => {
    onChange?.(e.htmlValue || "")
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        <Editor value={value} onTextChange={handleTextChange} style={{ height: "320px" }} placeholder={placeholder} />
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>Utilisez la barre d'outils pour formater votre texte</span>
          <span>{value.replace(/<[^>]*>/g, "").length} caractères</span>
        </div>
      </div>
    </div>
  )
}
