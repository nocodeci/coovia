import ContentSection from '../components/content-section'
import NotificationsForm from './notifications-form'
import { IconBell } from '@tabler/icons-react'

export default function SettingsNotifications() {
  return (
    <ContentSection
      title="Notifications"
      desc="Configurez vos préférences de notification pour rester informé des événements importants et des mises à jour."
      icon={IconBell}
      badge="Communication"
    >
      <NotificationsForm />
    </ContentSection>
  )
}
