import ContentSection from '../components/content-section'
import ParametersForm from './parameters-form'
import { IconSettings } from '@tabler/icons-react'

export default function SettingsParameters() {
  return (
    <ContentSection
      title="Paramètres Généraux"
      desc="Configurez les paramètres globaux de l'application Coovia pour personnaliser l'expérience utilisateur."
      icon={IconSettings}
      badge="Administrateur"
    >
      <ParametersForm />
    </ContentSection>
  )
}
