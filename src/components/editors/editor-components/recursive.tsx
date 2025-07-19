"use client"
import type { EditorElement } from "@/providers/editor/editor-provider"
import TextComponent from "./text"
import Container from "./container"
import VideoComponent from "./video"
import LinkComponent from "./link-component"
import ContactFormComponent from "./contact-form-component"
import TwoColumns from "./two-columns"

type Props = {
  element: EditorElement
}

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />
    case "container":
      return <Container element={element} />
    case "video":
      return <VideoComponent element={element} />
    case "link":
      return <LinkComponent element={element} />
    case "contactForm":
      return <ContactFormComponent element={element} />
    case "2Col":
      return <TwoColumns element={element} />
    case "__body":
      return <Container element={element} />
    default:
      return null
  }
}

export default Recursive
