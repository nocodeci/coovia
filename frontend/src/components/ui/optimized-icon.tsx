import React from 'react'

// Import optimisé des icônes Tabler - seulement celles utilisées
import {
  IconBuilding,
  IconMail,
  IconBell,
  IconSettings,
  IconGlobe,
  IconUser,
  IconShield,
  IconPhone,
  IconMapPin,
  IconLock,
  IconCreditCard,
  IconFile,
  IconSearch,
  IconDatabase,
  IconApi,
  IconAlertTriangle,
} from '@tabler/icons-react'

// Types pour les props des icônes
interface IconProps {
  name: string
  size?: number
  className?: string
  color?: string
  stroke?: number
}

// Composant d'icône optimisé avec tree-shaking
export const OptimizedIcon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = '', 
  color = 'currentColor',
  stroke = 1.5 
}) => {
  // Mapping des icônes Tabler - seulement celles utilisées
  const tablerIcons: Record<string, React.ComponentType<any>> = {
    'building': IconBuilding,
    'mail': IconMail,
    'bell': IconBell,
    'settings': IconSettings,
    'globe': IconGlobe,
    'user': IconUser,
    'shield': IconShield,
    'phone': IconPhone,
    'map-pin': IconMapPin,
    'lock': IconLock,
    'credit-card': IconCreditCard,
    'file': IconFile,
    'search': IconSearch,
    'database': IconDatabase,
    'api': IconApi,
    'alert-triangle': IconAlertTriangle,
  }

  // Recherche de l'icône
  const IconComponent = tablerIcons[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <IconComponent
      size={size}
      className={className}
      color={color}
      stroke={stroke}
    />
  )
}

export default OptimizedIcon