"use client"
import { Badge } from "@/components/ui/badge"
import { type EditorElement, useEditor } from "@/providers/editor/editor-provider"
import clsx from "clsx"
import { Trash } from "lucide-react"
import type React from "react"
import Recursive from "./recursive"

type Props = {
  element: EditorElement
}

const Container = ({ element }: Props) => {
  const { dispatch, state } = useEditor()

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation()
    const componentType = e.dataTransfer.getData("componentType") as any

    if (componentType) {
      const newElement: EditorElement = {
        id: `element-${Date.now()}`,
        name: componentType,
        type: componentType,
        styles: {},
        content: componentType === "text" ? { innerText: "Text Element" } : [],
      }

      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: element.id,
          elementDetails: newElement,
        },
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    })
  }

  return (
    <div
      style={element.styles}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": element.type === "container" || element.type === "__body",
        "h-fit": element.type === "container",
        "h-screen": element.type === "__body",
        "overflow-scroll": element.type === "__body",
        "flex flex-col md:!flex-row": element.type === "container",
        "!border-blue-500":
          state.editor.selectedElement.id === element.id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === element.id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid": state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
      onClick={handleOnClickBody}
    >
      <Badge
        className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden", {
          block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        })}
      >
        {element.name}
      </Badge>

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
          </div>
        )}

      {Array.isArray(element.content) &&
        element.content.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}
    </div>
  )
}

export default Container
