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

const TwoColumns = ({ element }: Props) => {
  const { dispatch, state } = useEditor()

  const handleOnDrop = (e: React.DragEvent, id: string) => {
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
          containerId: id,
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
      className={clsx("relative p-4 transition-all", {
        "h-fit": true,
        "flex flex-col md:!flex-row": true,
        "!border-blue-500": state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        "!border-solid": state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      <Badge
        className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden", {
          block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        })}
      >
        {element.name}
      </Badge>

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
        </div>
      )}

      {Array.isArray(element.content) &&
        element.content.map((childElement) => (
          <div
            key={childElement.id}
            className="flex-1 min-h-[100px]"
            onDrop={(e) => handleOnDrop(e, childElement.id)}
            onDragOver={handleDragOver}
          >
            <Recursive element={childElement} />
          </div>
        ))}
    </div>
  )
}

export default TwoColumns
