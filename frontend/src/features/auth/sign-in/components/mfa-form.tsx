"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSanctumAuth } from "@/hooks/useSanctumAuth"

const mfaSchema = z.object({
  code: z.string().min(6, "Le code doit contenir au moins 6 caractères"),
})

type MfaFormData = z.infer<typeof mfaSchema>

export function MfaForm() {
  const [activeTab, setActiveTab] = useState("totp")
  const { verifyMfa, mfaToken, backupCodesAvailable, resetMfaState, isLoading } = useSanctumAuth()

  const form = useForm<MfaFormData>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: MfaFormData) => {
    if (!mfaToken) return

    try {
      await verifyMfa({
        mfa_token: mfaToken,
        code: data.code,
        is_backup_code: activeTab === "backup",
      })
    } catch (error) {
      console.error("MFA verification error:", error)
    }
  }

  const handleBack = () => {
    resetMfaState()
    form.reset()
  }

  return (
    <div className="grid gap-6">
      <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit" disabled={isLoading}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="totp">Code d'authentification</TabsTrigger>
          <TabsTrigger value="backup" disabled={!backupCodesAvailable}>
            Code de récupération
          </TabsTrigger>
        </TabsList>

        <TabsContent value="totp" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code d'authentification</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        maxLength={6}
                        autoComplete="one-time-code"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Vérifier
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code de récupération</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="XXXXXXXX"
                        maxLength={8}
                        autoComplete="one-time-code"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Utiliser le code de récupération
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
