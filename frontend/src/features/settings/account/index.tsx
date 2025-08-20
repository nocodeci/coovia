import ContentSection from '../components/content-section'
import AccountForm from './account-form'
import { IconShield } from '@tabler/icons-react'

export default function SettingsAccount() {
  return (
    <ContentSection
      title="Compte"
      desc="Gérez vos paramètres de compte, de sécurité et vos préférences de confidentialité pour protéger vos données."
      icon={IconShield}
      badge="Sécurité"
    >
      <AccountForm />
    </ContentSection>
  )
}
