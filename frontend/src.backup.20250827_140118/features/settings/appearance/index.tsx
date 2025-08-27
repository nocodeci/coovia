import ContentSection from '../components/content-section'
import AppearanceForm from './appearance-form'
import { IconPalette } from '@tabler/icons-react'

export default function SettingsAppearance() {
  return (
    <ContentSection
      title="Apparence"
      desc="Personnalisez l'apparence de votre interface utilisateur avec des thèmes, des couleurs et des options d'accessibilité."
      icon={IconPalette}
      badge="Personnalisation"
    >
      <AppearanceForm />
    </ContentSection>
  )
}
