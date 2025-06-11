import ContactPageForm from "../../components/forms/ContactPageForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";

const contactsFormsColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  {
    key: "email" as const,
    label: "CORREO",
  },
  {
    key: "message" as const,
    label: "MENSAJE",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

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
      <div className="flex flex-col space-y-4">
        <h1>Mensajes de contacto</h1>
        <DataTable columns={contactsFormsColumns} rows={[]} />
      </div>
    </div>
  );
}
