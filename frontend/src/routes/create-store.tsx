import { createFileRoute } from '@tanstack/react-router'
import { CreateStore } from "@/features/stores/create-store"

export const Route = createFileRoute('/create-store')({
  component: CreateStore,
}) 