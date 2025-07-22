export interface Client {
    id: string
    name: string
    email: string
    phone: string
    location: string
    avatar?: string
    status: "active" | "inactive" | "blocked"
    segment: "VIP" | "Premium" | "Standard" | "Nouveau"
    joinDate: string
    lastActivity: string
    totalOrders: number
    totalSpent: number
    recentOrders?: {
      product: string
      amount: number
      date: string
      status: "completed" | "pending" | "cancelled"
    }[]
  }
  
  export const mockClients: Client[] = [
    {
      id: "CLI001",
      name: "Amadou Diallo",
      email: "amadou.diallo@email.com",
      phone: "+221 77 123 45 67",
      location: "Dakar, Sénégal",
      status: "active",
      segment: "VIP",
      joinDate: "2023-01-15T10:30:00Z",
      lastActivity: "Il y a 2 heures",
      totalOrders: 24,
      totalSpent: 485000,
      recentOrders: [
        {
          product: "Formation React Avancée",
          amount: 75000,
          date: "2024-01-15",
          status: "completed",
        },
        {
          product: "Template E-commerce",
          amount: 25000,
          date: "2024-01-10",
          status: "completed",
        },
        {
          product: "Consultation SEO",
          amount: 50000,
          date: "2024-01-05",
          status: "pending",
        },
      ],
    },
    {
      id: "CLI002",
      name: "Fatou Sow",
      email: "fatou.sow@email.com",
      phone: "+221 76 987 65 43",
      location: "Thiès, Sénégal",
      status: "active",
      segment: "Premium",
      joinDate: "2023-03-22T14:20:00Z",
      lastActivity: "Il y a 1 jour",
      totalOrders: 12,
      totalSpent: 180000,
      recentOrders: [
        {
          product: "Guide Marketing Digital",
          amount: 25000,
          date: "2024-01-12",
          status: "completed",
        },
        {
          product: "Pack d'Icônes Premium",
          amount: 8000,
          date: "2024-01-08",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI003",
      name: "Moussa Traoré",
      email: "moussa.traore@email.com",
      phone: "+223 70 123 45 67",
      location: "Bamako, Mali",
      status: "active",
      segment: "Standard",
      joinDate: "2023-06-10T09:15:00Z",
      lastActivity: "Il y a 3 jours",
      totalOrders: 8,
      totalSpent: 95000,
      recentOrders: [
        {
          product: "E-book JavaScript",
          amount: 25000,
          date: "2024-01-14",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI004",
      name: "Aïcha Koné",
      email: "aicha.kone@email.com",
      phone: "+226 70 123 45 67",
      location: "Ouagadougou, Burkina Faso",
      status: "inactive",
      segment: "Standard",
      joinDate: "2023-08-05T16:45:00Z",
      lastActivity: "Il y a 2 semaines",
      totalOrders: 3,
      totalSpent: 45000,
      recentOrders: [
        {
          product: "Template Site Web",
          amount: 15000,
          date: "2023-12-20",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI005",
      name: "Ibrahim Camara",
      email: "ibrahim.camara@email.com",
      phone: "+224 62 123 45 67",
      location: "Conakry, Guinée",
      status: "active",
      segment: "VIP",
      joinDate: "2022-11-30T11:10:00Z",
      lastActivity: "Il y a 5 heures",
      totalOrders: 35,
      totalSpent: 720000,
      recentOrders: [
        {
          product: "Formation Next.js Complète",
          amount: 89000,
          date: "2024-01-16",
          status: "completed",
        },
        {
          product: "Plugin WordPress SEO",
          amount: 35000,
          date: "2024-01-13",
          status: "completed",
        },
        {
          product: "Consultation Développement",
          amount: 75000,
          date: "2024-01-11",
          status: "pending",
        },
      ],
    },
    {
      id: "CLI006",
      name: "Grace Nakamura",
      email: "grace.nakamura@email.com",
      phone: "+256 78 123 45 67",
      location: "Kampala, Uganda",
      status: "active",
      segment: "Premium",
      joinDate: "2023-09-12T13:45:00Z",
      lastActivity: "Il y a 6 heures",
      totalOrders: 15,
      totalSpent: 285000,
      recentOrders: [
        {
          product: "Dashboard Admin React",
          amount: 49000,
          date: "2024-01-14",
          status: "completed",
        },
        {
          product: "Formation Python",
          amount: 45000,
          date: "2024-01-09",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI007",
      name: "Kwame Asante",
      email: "kwame.asante@email.com",
      phone: "+233 24 123 45 67",
      location: "Accra, Ghana",
      status: "active",
      segment: "Standard",
      joinDate: "2023-12-01T12:15:00Z",
      lastActivity: "Il y a 1 jour",
      totalOrders: 6,
      totalSpent: 125000,
      recentOrders: [
        {
          product: "Template Shopify",
          amount: 65000,
          date: "2024-01-13",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI008",
      name: "Amina Hassan",
      email: "amina.hassan@email.com",
      phone: "+254 70 123 45 67",
      location: "Nairobi, Kenya",
      status: "active",
      segment: "Nouveau",
      joinDate: "2024-01-10T16:30:00Z",
      lastActivity: "Il y a 4 heures",
      totalOrders: 2,
      totalSpent: 40000,
      recentOrders: [
        {
          product: "Guide Marketing Digital",
          amount: 25000,
          date: "2024-01-15",
          status: "completed",
        },
        {
          product: "Pack d'Icônes",
          amount: 8000,
          date: "2024-01-12",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI009",
      name: "Emmanuel Okafor",
      email: "emmanuel.okafor@email.com",
      phone: "+234 80 123 45 67",
      location: "Lagos, Nigeria",
      status: "blocked",
      segment: "Standard",
      joinDate: "2023-07-20T11:20:00Z",
      lastActivity: "Il y a 1 mois",
      totalOrders: 5,
      totalSpent: 85000,
      recentOrders: [
        {
          product: "Formation React",
          amount: 75000,
          date: "2023-12-15",
          status: "cancelled",
        },
      ],
    },
    {
      id: "CLI010",
      name: "Mariam Diallo",
      email: "mariam.diallo@email.com",
      phone: "+224 62 987 65 43",
      location: "Conakry, Guinée",
      status: "active",
      segment: "Premium",
      joinDate: "2023-04-18T14:50:00Z",
      lastActivity: "Il y a 8 heures",
      totalOrders: 18,
      totalSpent: 320000,
      recentOrders: [
        {
          product: "Logiciel Gestion Stock",
          amount: 125000,
          date: "2024-01-11",
          status: "completed",
        },
        {
          product: "Support Premium",
          amount: 50000,
          date: "2024-01-08",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI011",
      name: "Sekou Touré",
      email: "sekou.toure@email.com",
      phone: "+224 65 123 45 67",
      location: "Kankan, Guinée",
      status: "active",
      segment: "Nouveau",
      joinDate: "2024-01-05T15:20:00Z",
      lastActivity: "Il y a 12 heures",
      totalOrders: 1,
      totalSpent: 15000,
      recentOrders: [
        {
          product: "Template Site Web",
          amount: 15000,
          date: "2024-01-06",
          status: "completed",
        },
      ],
    },
    {
      id: "CLI012",
      name: "Esther Nyong",
      email: "esther.nyong@email.com",
      phone: "+237 67 123 45 67",
      location: "Yaoundé, Cameroun",
      status: "active",
      segment: "Standard",
      joinDate: "2023-10-25T12:30:00Z",
      lastActivity: "Il y a 2 jours",
      totalOrders: 9,
      totalSpent: 165000,
      recentOrders: [
        {
          product: "Formation Python",
          amount: 45000,
          date: "2024-01-10",
          status: "completed",
        },
        {
          product: "E-book JavaScript",
          amount: 25000,
          date: "2024-01-07",
          status: "completed",
        },
      ],
    },
  ]
  