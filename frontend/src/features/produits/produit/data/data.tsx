import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const categories = [
  {
    value: "arts-creatifs",
    label: "Arts Créatifs",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "logiciel",
    label: "Logiciel",
    icon: CircleIcon,
  },
  {
    value: "e-book",
    label: "E-book",
    icon: StopwatchIcon,
  },
  {
    value: "ebook",
    label: "E-book",
    icon: StopwatchIcon,
  },
  {
    value: "cours-en-ligne",
    label: "Cours en ligne",
    icon: CheckCircledIcon,
  },
  {
    value: "formation",
    label: "Formation",
    icon: CheckCircledIcon,
  },
  {
    value: "cours",
    label: "Cours",
    icon: CheckCircledIcon,
  },
  {
    value: "template",
    label: "Template",
    icon: CrossCircledIcon,
  },
  {
    value: "plugin",
    label: "Plugin",
    icon: CircleIcon,
  },
  {
    value: "consultation",
    label: "Consultation",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: StopwatchIcon,
  },
]

export const statuses = [
  {
    value: "brouillon",
    label: "Brouillon",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "actif",
    label: "Actif",
    icon: CheckCircledIcon,
  },
  {
    value: "inactif",
    label: "Inactif",
    icon: CrossCircledIcon,
  },
  {
    value: "archive",
    label: "Archivé",
    icon: StopwatchIcon,
  },
]

export const types = [
  {
    value: "telechargeable",
    label: "Téléchargeable",
    icon: ArrowDownIcon,
  },
  {
    value: "cours",
    label: "Cours",
    icon: ArrowRightIcon,
  },
  {
    value: "service",
    label: "Service",
    icon: ArrowUpIcon,
  },
  {
    value: "abonnement",
    label: "Abonnement",
    icon: CircleIcon,
  },
]

// Filtres pour les prix
export const priceRanges = [
  {
    value: "gratuit",
    label: "Gratuit",
    icon: CheckCircledIcon,
  },
  {
    value: "0-25000",
    label: "0 - 25 000 CFA",
    icon: CircleIcon,
  },
  {
    value: "25000-50000",
    label: "25 000 - 50 000 CFA",
    icon: CircleIcon,
  },
  {
    value: "50000-100000",
    label: "50 000 - 100 000 CFA",
    icon: CircleIcon,
  },
  {
    value: "100000+",
    label: "100 000+ CFA",
    icon: CircleIcon,
  },
]
