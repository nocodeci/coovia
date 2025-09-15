import ParametersForm from './parameters/parameters-form'

export default function SettingsParameters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres Généraux</h3>
        <p className="text-sm text-muted-foreground">
          Configurez les paramètres généraux de votre application.
        </p>
      </div>
      <ParametersForm />
    </div>
  )
}
