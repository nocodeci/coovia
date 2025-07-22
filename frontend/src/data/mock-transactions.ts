import type { PaymentTransaction } from "../types/payment"
import { paymentGateways } from "../payement-gateways"

export const mockTransactions: PaymentTransaction[] = [
  // Transactions existantes (Janvier 2024 - Juin 2025) - Mises à jour pour refléter une période plus longue
  {
    id: "PAY001",
    clientName: "Jean Dupont",
    status: "Succès",
    location: "Dakar, SN",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Sénégal
    value: 150,
    progression: 100,
    joinDate: "2024-01-15T14:30:00",
  },
  {
    id: "PAY002",
    clientName: "Marie Martin",
    status: "En Attente",
    location: "Abidjan, CI",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[0], // Orange Money CI
    value: 75,
    progression: 65,
    joinDate: "2024-02-14T09:15:00",
  },
  {
    id: "PAY003",
    clientName: "Pierre Durand",
    status: "Échec",
    location: "Kampala, UG",
    verified: false,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[1], // Airtel Money Ouganda
    value: 200,
    progression: 25,
    joinDate: "2024-03-13T16:45:00",
  },
  {
    id: "PAY004",
    clientName: "Sophie Bernard",
    status: "Initié",
    location: "Lomé, TG",
    verified: true,
    paymentGateway: paymentGateways[3], // CinetPay
    paymentMethod: paymentGateways[3].supportedMethods[0], // Moov Money Togo
    value: 120,
    progression: 10,
    joinDate: "2024-04-12T11:20:00",
  },
  {
    id: "PAY005",
    clientName: "Antoine Moreau",
    status: "Succès",
    location: "Lagos, NG",
    verified: true,
    paymentGateway: paymentGateways[4], // Paystack
    paymentMethod: paymentGateways[4].supportedMethods[0], // Visa Card
    value: 89,
    progression: 100,
    joinDate: "2024-05-11T13:10:00",
  },
  {
    id: "PAY006",
    clientName: "Camille Leroy",
    status: "En Attente",
    location: "Accra, GH",
    verified: false,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[2], // Virement Bancaire Ghana
    value: 300,
    progression: 45,
    joinDate: "2024-06-10T08:30:00",
  },
  {
    id: "PAY007",
    clientName: "Amadou Diallo",
    status: "Succès",
    location: "Cotonou, BJ",
    verified: true,
    paymentGateway: paymentGateways[1], // FedaPay
    paymentMethod: paymentGateways[1].supportedMethods[1], // Moov Money Bénin
    value: 180,
    progression: 100,
    joinDate: "2024-07-09T15:20:00",
  },
  {
    id: "PAY008",
    clientName: "Fatou Sow",
    status: "En Attente",
    location: "Ouagadougou, BF",
    verified: true,
    paymentGateway: paymentGateways[3], // CinetPay
    paymentMethod: paymentGateways[3].supportedMethods[1], // Orange Money Burkina Faso
    value: 95,
    progression: 80,
    joinDate: "2024-08-08T10:45:00",
  },
  {
    id: "PAY009",
    clientName: "Kwame Asante",
    status: "Succès",
    location: "Accra, GH",
    verified: true,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[0], // MTN Mobile Money Ghana
    value: 250,
    progression: 100,
    joinDate: "2024-09-07T12:15:00",
  },
  {
    id: "PAY010",
    clientName: "Amina Hassan",
    status: "Succès",
    location: "Nairobi, KE",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[2], // M-Pesa Kenya
    value: 175,
    progression: 100,
    joinDate: "2024-10-06T16:30:00",
  },

  // Transactions récentes pour juillet 2025
  {
    id: "PAY011",
    clientName: "Idrissa Kone",
    status: "Succès",
    location: "Bamako, ML",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[2], // Moov Money Mali (example, adjusted from Benin)
    value: 320,
    progression: 100,
    joinDate: "2025-07-14T10:15:00",
  },
  {
    id: "PAY012",
    clientName: "Zara Traore",
    status: "En Attente",
    location: "Ouagadougou, BF",
    verified: true,
    paymentGateway: paymentGateways[3], // CinetPay
    paymentMethod: paymentGateways[3].supportedMethods[1], // Orange Money Burkina Faso
    value: 85,
    progression: 70,
    joinDate: "2025-07-13T14:22:00",
  },
  {
    id: "PAY013",
    clientName: "Kofi Annan",
    status: "Succès",
    location: "Kumasi, GH",
    verified: true,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[0], // MTN Mobile Money Ghana
    value: 195,
    progression: 100,
    joinDate: "2025-07-12T16:45:00",
  },
  {
    id: "PAY014",
    clientName: "Fatima Zahra",
    status: "Échec",
    location: "Dakar, SN",
    verified: false,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Sénégal
    value: 125,
    progression: 15,
    joinDate: "2025-07-11T09:30:00",
  },
  {
    id: "PAY015",
    clientName: "Emeka Obi",
    status: "Succès",
    location: "Abuja, NG",
    verified: true,
    paymentGateway: paymentGateways[4], // Paystack
    paymentMethod: paymentGateways[4].supportedMethods[1], // MasterCard
    value: 450,
    progression: 100,
    joinDate: "2025-07-10T11:20:00",
  },
  {
    id: "PAY016",
    clientName: "Chika Okoro",
    status: "Initié",
    location: "Kampala, UG",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[0], // MTN Mobile Money Ouganda
    value: 275,
    progression: 5,
    joinDate: "2025-07-09T13:45:00",
  },
  {
    id: "PAY017",
    clientName: "Moussa Sylla",
    status: "Succès",
    location: "Abidjan, CI",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[0], // Orange Money CI
    value: 165,
    progression: 100,
    joinDate: "2025-07-08T08:15:00",
  },
  {
    id: "PAY018",
    clientName: "Adja Diallo",
    status: "En Attente",
    location: "Lomé, TG",
    verified: true,
    paymentGateway: paymentGateways[3], // CinetPay
    paymentMethod: paymentGateways[3].supportedMethods[0], // Moov Money Togo
    value: 110,
    progression: 55,
    joinDate: "2025-07-07T15:30:00",
  },
  {
    id: "PAY019",
    clientName: "David Kimani",
    status: "Succès",
    location: "Nairobi, KE",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[2], // M-Pesa Kenya
    value: 340,
    progression: 100,
    joinDate: "2025-07-06T12:10:00",
  },
  {
    id: "PAY020",
    clientName: "Nafisa Sani",
    status: "Échec",
    location: "Cotonou, BJ",
    verified: false,
    paymentGateway: paymentGateways[1], // FedaPay
    paymentMethod: paymentGateways[1].supportedMethods[0], // MTN Mobile Money Bénin
    value: 95,
    progression: 30,
    joinDate: "2025-07-05T17:25:00",
  },
  {
    id: "PAY021",
    clientName: "Oumar Thiam",
    status: "Succès",
    location: "Conakry, GN",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Guinée (example)
    value: 220,
    progression: 100,
    joinDate: "2025-07-04T10:40:00",
  },
  {
    id: "PAY022",
    clientName: "Esther Kojo",
    status: "Initié",
    location: "Accra, GH",
    verified: true,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[1], // Vodafone Cash Ghana
    value: 180,
    progression: 20,
    joinDate: "2025-07-03T14:55:00",
  },
  {
    id: "PAY023",
    clientName: "Ahmed Bello",
    status: "Succès",
    location: "Kano, NG",
    verified: true,
    paymentGateway: paymentGateways[4], // Paystack
    paymentMethod: paymentGateways[4].supportedMethods[3], // USSD Nigeria
    value: 135,
    progression: 100,
    joinDate: "2025-07-02T09:20:00",
  },
  {
    id: "PAY024",
    clientName: "Mercy Adisa",
    status: "En Attente",
    location: "Kampala, UG",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[1], // Airtel Money Ouganda
    value: 290,
    progression: 85,
    joinDate: "2025-07-01T16:35:00",
  },
  {
    id: "PAY025",
    clientName: "Amadou Diallo",
    status: "Succès",
    location: "Bamako, ML",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[2], // Moov Money Mali (example)
    value: 155,
    progression: 100,
    joinDate: "2025-06-30T11:50:00",
  },
  {
    id: "PAY026",
    clientName: "Sandra Boateng",
    status: "Échec",
    location: "Takoradi, GH",
    verified: false,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[2], // Virement Bancaire Ghana
    value: 380,
    progression: 25,
    joinDate: "2025-06-29T13:15:00",
  },
  {
    id: "PAY027",
    clientName: "Musa Usman",
    status: "Succès",
    location: "Abuja, NG",
    verified: true,
    paymentGateway: paymentGateways[4], // Paystack
    paymentMethod: paymentGateways[4].supportedMethods[0], // Visa Card
    value: 520,
    progression: 100,
    joinDate: "2025-06-28T08:45:00",
  },
  {
    id: "PAY028",
    clientName: "Fanta Cissé",
    status: "Initié",
    location: "Conakry, GN",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Guinée (example)
    value: 75,
    progression: 10,
    joinDate: "2025-06-27T15:20:00",
  },
  {
    id: "PAY029",
    clientName: "Junior Nkwem",
    status: "Succès",
    location: "Douala, CM",
    verified: true,
    paymentGateway: paymentGateways[3], // CinetPay
    paymentMethod: paymentGateways[3].supportedMethods[3], // Visa Card
    value: 245,
    progression: 100,
    joinDate: "2025-06-26T12:30:00",
  },
  {
    id: "PAY030",
    clientName: "Zola Mapisa",
    status: "En Attente",
    location: "Dar es Salaam, TZ",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[3], // Tigo Pesa Tanzanie
    value: 190,
    progression: 60,
    joinDate: "2025-06-25T10:10:00",
  },
  {
    id: "PAY031",
    clientName: "Mame Diarra",
    status: "Succès",
    location: "Dakar, SN",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Sénégal
    value: 310,
    progression: 100,
    joinDate: "2025-06-24T14:45:00",
  },
  {
    id: "PAY032",
    clientName: "Kwasi Nkrumah",
    status: "Échec",
    location: "Kisumu, KE",
    verified: false,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[2], // M-Pesa Kenya
    value: 125,
    progression: 20,
    joinDate: "2025-06-23T09:25:00",
  },
  {
    id: "PAY033",
    clientName: "Bintou Touré",
    status: "Succès",
    location: "Abidjan, CI",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[3], // MTN Mobile Money CI
    value: 205,
    progression: 100,
    joinDate: "2025-06-22T16:15:00",
  },
  {
    id: "PAY034",
    clientName: "Samuel Agyemang",
    status: "Initié",
    location: "Cape Coast, GH",
    verified: true,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[0], // MTN Mobile Money Ghana
    value: 160,
    progression: 15,
    joinDate: "2025-06-21T11:40:00",
  },
  {
    id: "PAY035",
    clientName: "Hadiza Abubakar",
    status: "Succès",
    location: "Kaduna, NG",
    verified: true,
    paymentGateway: paymentGateways[4], // Paystack
    paymentMethod: paymentGateways[4].supportedMethods[2], // Virement Bancaire Nigeria
    value: 425,
    progression: 100,
    joinDate: "2025-06-20T13:20:00",
  },
  {
    id: "PAY036",
    clientName: "Grace Wambui",
    status: "En Attente",
    location: "Eldoret, KE",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[2], // M-Pesa Kenya
    value: 85,
    progression: 75,
    joinDate: "2025-06-19T08:55:00",
  },
  {
    id: "PAY037",
    clientName: "Kwame Nkrumah",
    status: "Succès",
    location: "Kumasi, GH",
    verified: true,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[1], // Vodafone Cash Ghana
    value: 275,
    progression: 100,
    joinDate: "2025-06-18T15:10:00",
  },
  {
    id: "PAY038",
    clientName: "Moussa Sane",
    status: "Échec",
    location: "Saint-Louis, SN",
    verified: false,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Sénégal
    value: 95,
    progression: 35,
    joinDate: "2025-06-17T12:25:00",
  },
  {
    id: "PAY039",
    clientName: "Wangari Maathai",
    status: "Succès",
    location: "Mombasa, KE",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[2], // M-Pesa Kenya
    value: 185,
    progression: 100,
    joinDate: "2025-06-16T10:35:00",
  },
  {
    id: "PAY040",
    clientName: "Bafode Diarra",
    status: "Initié",
    location: "Sikasso, ML",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[2], // Moov Money Mali (example)
    value: 140,
    progression: 25,
    joinDate: "2025-06-15T14:50:00",
  },
  {
    id: "PAY041",
    clientName: "Nadia Kone",
    status: "Succès",
    location: "Abidjan, CI",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[0], // Orange Money CI
    value: 210,
    progression: 100,
    joinDate: "2025-07-14T11:00:00",
  },
  {
    id: "PAY042",
    clientName: "Oluwafemi Adebayo",
    status: "En Attente",
    location: "Lagos, NG",
    verified: true,
    paymentGateway: paymentGateways[4], // Paystack
    paymentMethod: paymentGateways[4].supportedMethods[1], // MasterCard
    value: 300,
    progression: 60,
    joinDate: "2025-07-13T09:00:00",
  },
  {
    id: "PAY043",
    clientName: "Aminata Camara",
    status: "Échec",
    location: "Conakry, GN",
    verified: false,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Guinée
    value: 80,
    progression: 20,
    joinDate: "2025-07-12T15:00:00",
  },
  {
    id: "PAY044",
    clientName: "Kwame Nkrumah",
    status: "Succès",
    location: "Accra, GH",
    verified: true,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[0], // MTN Mobile Money Ghana
    value: 250,
    progression: 100,
    joinDate: "2025-07-11T10:00:00",
  },
  {
    id: "PAY045",
    clientName: "Amina Abdullahi",
    status: "Initié",
    location: "Nairobi, KE",
    verified: true,
    paymentGateway: paymentGateways[2], // PawaPay
    paymentMethod: paymentGateways[2].supportedMethods[2], // M-Pesa Kenya
    value: 170,
    progression: 10,
    joinDate: "2025-07-10T14:00:00",
  },
  {
    id: "PAY046",
    clientName: "Sékou Traoré",
    status: "Succès",
    location: "Bamako, ML",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[2], // Moov Money Mali
    value: 190,
    progression: 100,
    joinDate: "2025-07-09T09:30:00",
  },
  {
    id: "PAY047",
    clientName: "Fatou Diatta",
    status: "En Attente",
    location: "Dakar, SN",
    verified: true,
    paymentGateway: paymentGateways[0], // PayDunya
    paymentMethod: paymentGateways[0].supportedMethods[1], // Orange Money Sénégal
    value: 115,
    progression: 70,
    joinDate: "2025-07-08T16:00:00",
  },
  {
    id: "PAY048",
    clientName: "Chukwudi Eze",
    status: "Succès",
    location: "Port Harcourt, NG",
    verified: true,
    paymentGateway: paymentGateways[4], // Paystack
    paymentMethod: paymentGateways[4].supportedMethods[0], // Visa Card
    value: 350,
    progression: 100,
    joinDate: "2025-07-07T11:30:00",
  },
  {
    id: "PAY049",
    clientName: "Aissatou Diallo",
    status: "Échec",
    location: "Ouagadougou, BF",
    verified: false,
    paymentGateway: paymentGateways[3], // CinetPay
    paymentMethod: paymentGateways[3].supportedMethods[1], // Orange Money Burkina Faso
    value: 65,
    progression: 15,
    joinDate: "2025-07-06T13:45:00",
  },
  {
    id: "PAY050",
    clientName: "Jide Adeyemi",
    status: "Succès",
    location: "Accra, GH",
    verified: true,
    paymentGateway: paymentGateways[5], // Flutterwave
    paymentMethod: paymentGateways[5].supportedMethods[2], // Virement Bancaire Ghana
    value: 400,
    progression: 100,
    joinDate: "2025-07-05T08:00:00",
  },
]