import SettingPageForm from "../../components/forms/SettingPageForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";

export default function SettingsPage() {
  return (
    <div className="flex flex-col w-full space-y-8">
      <HeaderPage
        title="Ajustes de cuenta"
        description="Actualiza las credenciales de tu cuenta aqui."
      />
      <SettingPageForm />
    </div>
  );
}
