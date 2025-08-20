import ContentSection from '../components/content-section'
import DisplayForm from './display-form'
import { IconLayout } from '@tabler/icons-react'

export default function SettingsDisplay() {
  return (
    <ContentSection
      title="Affichage"
      desc="Personnalisez l'affichage et la mise en page de votre interface pour optimiser votre expérience utilisateur."
      icon={IconLayout}
      badge="Interface"
    >
      <DisplayForm />
    </ContentSection>
  )
}
