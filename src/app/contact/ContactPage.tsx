import ContactPageForm from "../../components/forms/ContactPageForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";

export default function ContactPage() {
  return (
    <div className="flex flex-col space-y-8">
      <HeaderPage
        title="Pagina Contacto"
        description="Controla desde aquí todo el contenido de la pagina contacto de tu portafolio."
      />
      <div className="flex flex-col">
        <h1>Sección de contacto</h1>
        <ContactPageForm />
      </div>
    </div>
  );
}
