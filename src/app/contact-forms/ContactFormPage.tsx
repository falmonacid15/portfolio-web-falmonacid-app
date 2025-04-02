import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import { FormContact } from "../../interfaces/models/FormContact";

const contactFormsColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  {
    key: "email" as const,
    label: "EMAIL",
  },
  {
    key: "message" as const,
    label: "MENSAJE",
  },
  {
    key: "createdAt" as const,
    label: "RECIBIDO EL",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

export default function ContactFormPage() {
  return (
    <div className="flex flex-col space-y-8">
      <HeaderPage
        title="Formularios de contacto"
        description="Lista de los formularios de contacto que ha completado la gente en tu portafolio."
      />
      <div className="p-4">
        <DataTable<Omit<FormContact, "">>
          columns={contactFormsColumns}
          rows={[]}
        />
      </div>
    </div>
  );
}
