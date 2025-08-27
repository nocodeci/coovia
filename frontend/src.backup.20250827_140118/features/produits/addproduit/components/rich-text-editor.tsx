import React, { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  ImageIcon,
  Palette,
  Type,
  Undo,
  Redo,
  Strikethrough,
  Code,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isEditorFocused, setIsEditorFocused] = useState(false)

  // Mise à jour du contenu de l'éditeur quand la valeur change
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      try {
        document.execCommand(command, false, value)
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML)
        }
      } catch (error) {
        console.warn(`Command ${command} not supported:`, error)
      }
    },
    [onChange],
  )

  const handleFormat = useCallback(
    (command: string, value?: string) => {
      if (editorRef.current) {
        editorRef.current.focus()
        executeCommand(command, value)
      }
    },
    [executeCommand],
  )

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          executeCommand("insertHTML", `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`)
        }
        reader.readAsDataURL(file)
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [executeCommand],
  )

  const insertLink = useCallback(() => {
    if (linkUrl) {
      executeCommand("createLink", linkUrl)
      setLinkUrl("")
      setShowLinkDialog(false)
    }
  }, [linkUrl, executeCommand])

  const insertImageUrl = useCallback(() => {
    if (imageUrl) {
      executeCommand("insertHTML", `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`)
      setImageUrl("")
      setShowImageDialog(false)
    }
  }, [imageUrl, executeCommand])

  const handleEditorChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Raccourcis clavier
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          handleFormat('bold')
          break
        case 'i':
          e.preventDefault()
          handleFormat('italic')
          break
        case 'u':
          e.preventDefault()
          handleFormat('underline')
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            handleFormat('redo')
          } else {
            handleFormat('undo')
          }
          break
      }
    }
  }

  const formatButtons = [
    { id: "bold", icon: Bold, label: "Gras (Ctrl+B)", command: "bold" },
    { id: "italic", icon: Italic, label: "Italique (Ctrl+I)", command: "italic" },
    { id: "underline", icon: Underline, label: "Souligné (Ctrl+U)", command: "underline" },
    { id: "strikethrough", icon: Strikethrough, label: "Barré", command: "strikeThrough" },
    { id: "code", icon: Code, label: "Code", command: "formatBlock", value: "pre" },
  ]

  const alignButtons = [
    { id: "align-left", icon: AlignLeft, label: "Aligner à gauche", command: "justifyLeft" },
    { id: "align-center", icon: AlignCenter, label: "Centrer", command: "justifyCenter" },
    { id: "align-right", icon: AlignRight, label: "Aligner à droite", command: "justifyRight" },
  ]

  const listButtons = [
    { id: "list", icon: List, label: "Liste à puces", command: "insertUnorderedList" },
    { id: "ordered-list", icon: ListOrdered, label: "Liste numérotée", command: "insertOrderedList" },
  ]

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", 
    "#00FFFF", "#FFA500", "#800080", "#008000", "#FFC0CB", "#A52A2A", 
    "#808080", "#000080", "#8B4513", "#DC143C"
  ]

  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"]

  const textWithoutHtml = value.replace(/<[^>]*>/g, "")

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-background rich-text-editor", className)}>
      {/* Barre d'outils principale */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/30">
        {/* Annuler/Refaire */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("undo")}
            className="h-8 w-8 p-0"
            title="Annuler (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("redo")}
            className="h-8 w-8 p-0"
            title="Refaire (Ctrl+Shift+Z)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Taille de police */}
        <Select onValueChange={(size) => handleFormat("fontSize", size.replace('px', ''))}>
          <SelectTrigger className="w-20 h-8">
            <Type className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Couleur du texte */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Couleur du texte">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="grid grid-cols-8 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleFormat("foreColor", color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Formatage de base */}
        {formatButtons.map((button) => {
          const Icon = button.icon
          return (
            <Button
              key={button.id}
              variant="ghost"
              size="sm"
              onClick={() => handleFormat(button.command, button.value)}
              className="h-8 w-8 p-0"
              title={button.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignement */}
        {alignButtons.map((button) => {
          const Icon = button.icon
          return (
            <Button
              key={button.id}
              variant="ghost"
              size="sm"
              onClick={() => handleFormat(button.command)}
              className="h-8 w-8 p-0"
              title={button.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Listes */}
        {listButtons.map((button) => {
          const Icon = button.icon
          return (
            <Button
              key={button.id}
              variant="ghost"
              size="sm"
              onClick={() => handleFormat(button.command)}
              className="h-8 w-8 p-0"
              title={button.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Citation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("formatBlock", "blockquote")}
          className="h-8 w-8 p-0"
          title="Citation"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* Lien */}
        <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ajouter un lien">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-3">
              <Label htmlFor="link-url">URL du lien</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemple.com"
                onKeyDown={(e) => e.key === 'Enter' && insertLink()}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowLinkDialog(false)}>
                  Annuler
                </Button>
                <Button size="sm" onClick={insertLink} disabled={!linkUrl}>
                  Ajouter
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image */}
        <Popover open={showImageDialog} onOpenChange={setShowImageDialog}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ajouter une image">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-3">
              <Label>Ajouter une image</Label>
              <div className="space-y-2">
                <Input 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  placeholder="URL de l'image"
                  onKeyDown={(e) => e.key === 'Enter' && insertImageUrl()}
                />
                <div className="text-center text-sm text-muted-foreground">ou</div>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger une image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowImageDialog(false)}>
                  Annuler
                </Button>
                <Button size="sm" onClick={insertImageUrl} disabled={!imageUrl}>
                  Ajouter
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Zone d'édition */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorChange}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          )}
          style={{ minHeight: "300px" }}
          suppressContentEditableWarning={true}
        />

        {/* Placeholder personnalisé */}
        {!value && !isEditorFocused && (
          <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none select-none">
            {placeholder}
          </div>
        )}

        {/* Compteur de caractères */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border">
          {textWithoutHtml.length} caractères
        </div>
      </div>

      {/* Suggestions rapides */}
      <div className="p-3 border-t bg-muted/20">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="font-medium text-muted-foreground">Suggestions rapides:</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const content =
                value +
                "<h3>✨ Points clés</h3><ul><li>Avantage principal</li><li>Bénéfice client</li><li>Valeur ajoutée</li></ul>"
              onChange(content)
            }}
          >
            Points clés
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const content =
                value +
                "<h3>🚀 Caractéristiques</h3><ul><li>Fonctionnalité 1</li><li>Fonctionnalité 2</li><li>Fonctionnalité 3</li></ul>"
              onChange(content)
            }}
          >
            Caractéristiques
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const content =
                value +
                '<blockquote style="border-left: 4px solid hsl(var(--border)); padding-left: 16px; margin: 16px 0; font-style: italic; color: hsl(var(--muted-foreground));">"Témoignage client ou citation importante"</blockquote>'
              onChange(content)
            }}
          >
            Citation
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const content =
                value +
                "<h3>💰 Tarification</h3><p><strong>Prix:</strong> À partir de X FCFA</p><p><strong>Inclus:</strong> Tout ce que vous obtenez</p>"
              onChange(content)
            }}
          >
            Tarification
          </Button>
        </div>
      </div>

      {/* Styles CSS pour l'éditeur */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .rich-text-editor [contenteditable] img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 8px 0;
          }

          .rich-text-editor [contenteditable] blockquote {
            border-left: 4px solid hsl(var(--border));
            padding-left: 16px;
            margin: 16px 0;
            font-style: italic;
            color: hsl(var(--muted-foreground));
          }

          .rich-text-editor [contenteditable] pre {
            background-color: hsl(var(--muted));
            padding: 12px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
          }

          .rich-text-editor [contenteditable] ul, 
          .rich-text-editor [contenteditable] ol {
            padding-left: 24px;
          }

          .rich-text-editor [contenteditable] h1, 
          .rich-text-editor [contenteditable] h2, 
          .rich-text-editor [contenteditable] h3 {
            margin: 16px 0 8px 0;
            font-weight: bold;
          }

          .rich-text-editor [contenteditable] h1 { font-size: 24px; }
          .rich-text-editor [contenteditable] h2 { font-size: 20px; }
          .rich-text-editor [contenteditable] h3 { font-size: 18px; }

          .rich-text-editor [contenteditable] a {
            color: hsl(var(--primary));
            text-decoration: underline;
          }

          .rich-text-editor [contenteditable] a:hover {
            color: hsl(var(--primary) / 0.8);
          }
        `,
        }}
      />
    </div>
  )
}