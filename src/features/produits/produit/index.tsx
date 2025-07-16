import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { ProduitsDialogs } from "./components/produits-dialogs"
import { ProduitsPrimaryButtons } from "./components/produits-primary-buttons"
import ProduitsProvider from "./context/produits-context"
import { produits } from "./data/produits"

export default function Produits() {
  return (
    <ProduitsProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Produits & Services</h2>
            <p className="text-muted-foreground">Gérez vos produits téléchargeables et services numériques</p>
          </div>
          <ProduitsPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={produits} columns={columns} />
        </div>
      </Main>

      <ProduitsDialogs />
    </ProduitsProvider>
  )
}
