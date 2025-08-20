import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'
import { IconUser } from '@tabler/icons-react'

export default function SettingsProfile() {
  return (
    <ContentSection
      title="Profil"
      desc="Gérez vos informations personnelles, votre avatar et vos préférences pour personnaliser votre expérience."
      icon={IconUser}
      badge="Personnel"
    >
      <ProfileForm />
    </ContentSection>
  )
}
