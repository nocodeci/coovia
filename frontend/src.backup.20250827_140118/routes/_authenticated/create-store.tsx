import { createFileRoute } from '@tanstack/react-router'
import { CreateStore } from "@/features/stores/create-store"

export const Route = createFileRoute('/_authenticated/create-store')({
  component: CreateStore,
})
