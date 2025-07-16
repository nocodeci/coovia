import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockTransactions } from "@/data/mock-transactions"

// Fonction pour extraire les initiales du nom
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Fonction pour générer un email basé sur le nom
const generateEmail = (name: string): string => {
  const nameParts = name.toLowerCase().split(" ")
  if (nameParts.length >= 2) {
    return `${nameParts[0]}.${nameParts[1]}@email.com`
  }
  return `${nameParts[0]}@email.com`
}

export function RecentSales() {
  // Filtrer les transactions avec le statut "Succès" et prendre les 5 plus récentes
  const successfulPayments = mockTransactions
    .filter((transaction) => transaction.status === "Succès")
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {successfulPayments.map((payment) => (
        <div key={payment.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${payment.id.toLowerCase()}.png`} alt="Avatar" />
            <AvatarFallback>{getInitials(payment.clientName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-wrap items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm leading-none font-medium">{payment.clientName}</p>
              <p className="text-muted-foreground text-sm">{generateEmail(payment.clientName)}</p>
            </div>
            <div className="font-medium">+{payment.value} CFA</div>
          </div>
        </div>
      ))}

      {successfulPayments.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">Aucun paiement réussi récent</div>
      )}
    </div>
  )
}
