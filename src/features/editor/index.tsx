"use client"
import PageEditor from "@/components/editors/page-editor"
import EditorSidebar from "@/components/editors/editor-sidebar"
import EditorProvider from "@/providers/editor/editor-provider"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useEditor } from "@/providers/editor/editor-provider"

const EditorNavigation = () => {
  const { dispatch, state } = useEditor()

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant={state.editor.device === "Desktop" ? "default" : "outline"}
          size="sm"
          onClick={() => dispatch({ type: "CHANGE_DEVICE", payload: { device: "Desktop" } })}
        >
          <Monitor size={16} />
        </Button>
        <Button
          variant={state.editor.device === "Tablet" ? "default" : "outline"}
          size="sm"
          onClick={() => dispatch({ type: "CHANGE_DEVICE", payload: { device: "Tablet" } })}
        >
          <Tablet size={16} />
        </Button>
        <Button
          variant={state.editor.device === "Mobile" ? "default" : "outline"}
          size="sm"
          onClick={() => dispatch({ type: "CHANGE_DEVICE", payload: { device: "Mobile" } })}
        >
          <Smartphone size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => dispatch({ type: "TOGGLE_PREVIEW_MODE" })}>
          {state.editor.previewMode ? "Edit" : "Preview"}
        </Button>
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={state.history.currentIndex === 0}
        >
          Undo
        </Button>
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "REDO" })}
          disabled={state.history.currentIndex === state.history.history.length - 1}
        >
          Redo
        </Button>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider>
        <EditorNavigation />
        <div className="h-full flex justify-center">
          <PageEditor pageId="demo-page" />
        </div>
        <EditorSidebar />
      </EditorProvider>
    </div>
  )
}
