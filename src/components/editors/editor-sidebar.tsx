"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEditor } from "@/providers/editor/editor-provider"
import type React from "react"
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react"
import clsx from "clsx"

const EditorSidebar = () => {
  const { state } = useEditor()

  return (
    <aside
      className={clsx(
        "fixed top-0 bottom-0 right-0 z-[80] bg-background/80 backdrop-blur-lg overflow-hidden transition-all",
        { hidden: state.editor.previewMode },
      )}
    >
      <Tabs defaultValue="Components" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit justify-evenly">
          <TabsTrigger value="Settings" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
            <SettingsIcon />
          </TabsTrigger>
          <TabsTrigger value="Components" className="data-[state=active]:bg-muted w-10 h-10 p-0">
            <Plus />
          </TabsTrigger>
          <TabsTrigger value="Layers" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
            <SquareStackIcon />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Settings">
          <div className="px-2 py-4 text-muted-foreground">
            <p className="text-sm">Settings Panel</p>
            {/* Ici vous pouvez ajouter les contrôles de style */}
          </div>
        </TabsContent>
        <TabsContent value="Components">
          <div className="grid grid-cols-1 gap-2 p-4">
            <ComponentButton type="text" label="Text" />
            <ComponentButton type="container" label="Container" />
            <ComponentButton type="video" label="Video" />
            <ComponentButton type="link" label="Link" />
            <ComponentButton type="contactForm" label="Contact Form" />
            <ComponentButton type="2Col" label="2 Columns" />
          </div>
        </TabsContent>
        <TabsContent value="Layers">
          <div className="px-2 py-4 text-muted-foreground">
            <p className="text-sm">Layers Panel</p>
            {/* Ici vous pouvez afficher la hiérarchie des éléments */}
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}

const ComponentButton = ({ type, label }: { type: string; label: string }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentType", type)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-muted"
    >
      <Database size={16} />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export default EditorSidebar
