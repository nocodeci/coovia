"use client"

import { useState } from "react"
import { IconAdjustmentsHorizontal, IconSortAscendingLetters, IconSortDescendingLetters } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Main } from "@/components/layout/main"
import { apps } from "./data/apps"
import { AppsTopBar } from "./components/apps-top-bar"

const appText = new Map<string, string>([
  ["all", "Toutes les applications"],
  ["connected", "Connectées"],
  ["notConnected", "Non connectées"],
])

export default function Apps() {
  const [sort, setSort] = useState("ascending")
  const [appType, setAppType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredApps = apps
    .sort((a, b) => (sort === "ascending" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    .filter((app) => (appType === "connected" ? app.connected : appType === "notConnected" ? !app.connected : true))
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const connectedApps = apps.filter((app) => app.connected).length
  const totalApps = apps.length

  const handleBack = () => {
    window.location.href = "/"
  }

  const handleFilterChange = (filters: any) => {
    if (filters.appType) {
      setAppType(filters.appType)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setAppType("all")
    setSort("ascending")
  }

  const handleConnectAll = () => {
    console.log("Connecter toutes les applications")
  }

  const handleRefresh = () => {
    console.log("Actualiser les applications")
  }

  const handleBulkAction = (action: string) => {
    console.log("Action en lot:", action)
  }

  return (
    <>
      {/* AppsTopBar avec recherche dynamique */}
      <AppsTopBar
        searchTerm={searchTerm}
        appType={appType}
        sort={sort}
        totalApps={totalApps}
        connectedApps={connectedApps}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onSortChange={setSort}
        onClearFilters={handleClearFilters}
        onBack={handleBack}
        onConnectAll={handleConnectAll}
        onRefresh={handleRefresh}
        onBulkAction={handleBulkAction}
      />

      {/* Contenu principal */}
      <Main fixed>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Intégrations d'applications</h1>
          <p className="text-muted-foreground">Voici une liste de vos applications pour l'intégration !</p>
        </div>

        {/* Indicateurs de filtres actifs */}
        {(searchTerm || appType !== "all") && (
          <div className="my-4 flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {searchTerm && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                Recherche: "{searchTerm}"
              </div>
            )}
            {appType !== "all" && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                Type: {appText.get(appType)}
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground">
              Effacer tout
            </Button>
          </div>
        )}

        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Filtrer les applications..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className="w-36">
                <SelectValue>{appText.get(appType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les applications</SelectItem>
                <SelectItem value="connected">Connectées</SelectItem>
                <SelectItem value="notConnected">Non connectées</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-16">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ascending">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Croissant</span>
                </div>
              </SelectItem>
              <SelectItem value="descending">
                <div className="flex items-center gap-4">
                  <IconSortDescendingLetters size={16} />
                  <span>Décroissant</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="shadow-sm" />

        <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <li key={app.name} className="rounded-lg border p-4 hover:shadow-md">
              <div className="mb-8 flex items-center justify-between">
                <div className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}>{app.logo}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    app.connected
                      ? "border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900"
                      : ""
                  }`}
                >
                  {app.connected ? "Connectée" : "Connecter"}
                </Button>
              </div>
              <div>
                <h2 className="mb-1 font-semibold">{app.name}</h2>
                <p className="line-clamp-2 text-gray-500">{app.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <IconAdjustmentsHorizontal size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucune application trouvée</h3>
            <p className="text-sm text-muted-foreground mb-4">Essayez de modifier votre recherche ou vos filtres.</p>
            <Button onClick={handleClearFilters}>Effacer les filtres</Button>
          </div>
        )}
      </Main>
    </>
  )
}
