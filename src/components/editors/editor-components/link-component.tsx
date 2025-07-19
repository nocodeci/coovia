"use client"
import { Badge } from "@/components/ui/badge"
import { type EditorElement, useEditor } from "@/providers/editor/editor-provider"
import clsx from "clsx"
import { Trash } from "lucide-react"
import { Link } from "@tanstack/react-router"
import type React from "react"

type Props = {
  element: EditorElement
}

const LinkComponent = ({ element }: Props) => {
  const { dispatch, state } = useEditor()

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    })
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

  return (
    <div
      style={element.styles}
      className={clsx("p-[2px] w-full m-[5px] relative text-[16px] transition-all", {
        "!border-blue-500 !border-solid": state.editor.selectedElement.id === element.id,
        "!border-solid": state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">{element.name}</Badge>
      )}

      {!Array.isArray(element.content) && <Link to={element.content?.href || "/"}>{element.content?.innerText}</Link>}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  )
}

export default LinkComponent
