import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useGlobalSettings, useUserProfile, useStoreSettings } from '@/hooks/useSettings'
import { toast } from 'sonner'

export function SettingsExample() {
  const { settings: globalSettings, loading: globalLoading, getSetting: getGlobalSetting } = useGlobalSettings()
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useUserProfile()
  const { settings: storeSettings, loading: storeLoading, setSetting } = useStoreSettings('example-store-id')

  const [activeTab, setActiveTab] = useState('global')

  const handleProfileUpdate = async (field: string, value: any) => {
    if (!profile) return

    const result = await updateProfile({ [field]: value })
    if (result.success) {
      toast.success('Profil mis à jour avec succès')
    } else {
      toast.error(result.error || 'Erreur lors de la mise à jour')
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const result = await uploadAvatar(file)
    if (result.success) {
      toast.success('Avatar mis à jour avec succès')
    } else {
      toast.error(result.error || 'Erreur lors de l\'upload')
    }
  }

  const handleStoreSettingUpdate = async (key: string, value: any, type: string = 'string', group: string = 'general') => {
    const result = await setSetting(key, value, type, group)
    if (result.success) {
      toast.success('Paramètre mis à jour avec succès')
    } else {
      toast.error(result.error || 'Erreur lors de la mise à jour')
    }
  }

  if (globalLoading || profileLoading || storeLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de l'application, votre profil et vos boutiques
          </p>
        </div>
        <Badge variant="secondary">
          {getGlobalSetting('app_name', 'Coovia')} v1.0.0
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Paramètres Globaux</TabsTrigger>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
          <TabsTrigger value="store">Paramètres Boutique</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'Application</CardTitle>
              <CardDescription>
                Paramètres globaux de l'application Coovia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'application</Label>
                  <Input 
                    value={getGlobalSetting('app_name', 'Coovia')} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={getGlobalSetting('app_description', '')} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Devise par défaut</Label>
                  <Input 
                    value={getGlobalSetting('app_currency', 'XOF')} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Langue par défaut</Label>
                  <Input 
                    value={getGlobalSetting('app_locale', 'fr')} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Passerelles de Paiement</h3>
                <div className="flex flex-wrap gap-2">
                  {getGlobalSetting('payment_gateways', []).map((gateway: string) => (
                    <Badge key={gateway} variant="outline">
                      {gateway}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mon Profil</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {profile?.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-muted-foreground">
                      {profile?.display_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <Separator />

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    value={profile?.first_name || ''}
                    onChange={(e) => handleProfileUpdate('first_name', e.target.value)}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={profile?.last_name || ''}
                    onChange={(e) => handleProfileUpdate('last_name', e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom d'affichage</Label>
                  <Input
                    value={profile?.display_name || ''}
                    onChange={(e) => handleProfileUpdate('display_name', e.target.value)}
                    placeholder="Nom d'affichage"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Input
                    value={profile?.company || ''}
                    onChange={(e) => handleProfileUpdate('company', e.target.value)}
                    placeholder="Votre entreprise"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={profile?.bio || ''}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="Parlez-nous de vous..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site web</Label>
                  <Input
                    value={profile?.website || ''}
                    onChange={(e) => handleProfileUpdate('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input
                    value={profile?.location || ''}
                    onChange={(e) => handleProfileUpdate('location', e.target.value)}
                    placeholder="Ville, Pays"
                  />
                </div>
              </div>

              <Separator />

              {/* Préférences */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Préférences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir les notifications par email
                      </p>
                    </div>
                    <Switch
                      checked={profile?.preferences?.notifications?.email ?? true}
                      onCheckedChange={(checked) => {
                        const newPreferences = {
                          ...profile?.preferences,
                          notifications: {
                            ...profile?.preferences?.notifications,
                            email: checked
                          }
                        }
                        handleProfileUpdate('preferences', newPreferences)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir les notifications push
                      </p>
                    </div>
                    <Switch
                      checked={profile?.preferences?.notifications?.push ?? true}
                      onCheckedChange={(checked) => {
                        const newPreferences = {
                          ...profile?.preferences,
                          notifications: {
                            ...profile?.preferences?.notifications,
                            push: checked
                          }
                        }
                        handleProfileUpdate('preferences', newPreferences)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profil visible</Label>
                      <p className="text-sm text-muted-foreground">
                        Rendre votre profil visible publiquement
                      </p>
                    </div>
                    <Switch
                      checked={profile?.preferences?.privacy?.profile_visible ?? true}
                      onCheckedChange={(checked) => {
                        const newPreferences = {
                          ...profile?.preferences,
                          privacy: {
                            ...profile?.preferences?.privacy,
                            profile_visible: checked
                          }
                        }
                        handleProfileUpdate('preferences', newPreferences)
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la Boutique</CardTitle>
              <CardDescription>
                Configurez les paramètres spécifiques à votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de la boutique</Label>
                  <Input
                    value={storeSettings['store_name'] || ''}
                    onChange={(e) => handleStoreSettingUpdate('store_name', e.target.value)}
                    placeholder="Nom de votre boutique"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Devise de la boutique</Label>
                  <Select
                    value={storeSettings['store_currency'] || 'XOF'}
                    onValueChange={(value) => handleStoreSettingUpdate('store_currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar US (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description de la boutique</Label>
                <Textarea
                  value={storeSettings['store_description'] || ''}
                  onChange={(e) => handleStoreSettingUpdate('store_description', e.target.value)}
                  placeholder="Description de votre boutique..."
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Méthodes de Paiement</h3>
                <div className="space-y-3">
                  {['orange_money', 'moov_money', 'mtn_money'].map((method) => (
                    <div key={method} className="flex items-center justify-between">
                      <div>
                        <Label className="capitalize">{method.replace('_', ' ')}</Label>
                        <p className="text-sm text-muted-foreground">
                          Accepter les paiements via {method.replace('_', ' ')}
                        </p>
                      </div>
                      <Switch
                        checked={storeSettings['payment_methods']?.includes(method) ?? false}
                        onCheckedChange={(checked) => {
                          const currentMethods = storeSettings['payment_methods'] || []
                          const newMethods = checked
                            ? [...currentMethods, method]
                            : currentMethods.filter((m: string) => m !== method)
                          handleStoreSettingUpdate('payment_methods', newMethods, 'json', 'payment')
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Nouvelles commandes</Label>
                      <p className="text-sm text-muted-foreground">
                        Être notifié des nouvelles commandes
                      </p>
                    </div>
                    <Switch
                      checked={storeSettings['notifications_new_order'] ?? true}
                      onCheckedChange={(checked) => handleStoreSettingUpdate('notifications_new_order', checked, 'boolean', 'notifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Paiements reçus</Label>
                      <p className="text-sm text-muted-foreground">
                        Être notifié des paiements reçus
                      </p>
                    </div>
                    <Switch
                      checked={storeSettings['notifications_payment_received'] ?? true}
                      onCheckedChange={(checked) => handleStoreSettingUpdate('notifications_payment_received', checked, 'boolean', 'notifications')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
