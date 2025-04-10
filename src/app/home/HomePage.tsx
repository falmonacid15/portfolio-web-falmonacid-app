import { useQuery } from "@tanstack/react-query";
import HomePageForm from "../../components/forms/HomePageForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import api from "../../lib/axios";

const workExperiencesColumns = [
  {
    key: "title",
    label: "TITULO",
  },
  {
    key: "dateRange",
    label: "RANGO DE FECHAS",
  },
  {
    key: "description",
    label: "DESCRIPCION",
  },
  {
    key: "actions",
    label: "ACCIONES",
  },
];
const projectsColumns = [
  {
    key: "name",
    label: "NOMBRE",
  },
  {
    key: "shortDescription",
    label: "DESCRIPCION CORTA",
  },
  {
    key: "hasDemo",
    label: "¿TIENE DEMO?",
  },
  {
    key: "hasRepo",
    label: "¿TIENE CODIGO FUENTE?",
  },
  {
    key: "actions",
    label: "ACCIONES",
  },
];

export default function HomePage() {
  const { data: workExperiences } = useQuery({
    queryKey: ["workExperiences"],
    queryFn: async () => {
      const { data } = await api.get("/work-experiences");
      return data.data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data.data;
    },
  });

  return (
    <div className="flex flex-col w-full">
      <HeaderPage
        title="Pagina Inicio"
        description="Controla desde aqui todo el contenido de la pagina de inicio de tu portafolio."
      />
      <HomePageForm />
      <div className="flex flex-col sm:flex-row w-full px-4 sm:px-16 mt-8 space-y-8 space-x-0 sm:space-y-0 sm:space-x-8">
        <div className="flex flex-col w-full space-y-4">
          <h2 className="text-lg font-medium">Experiencias laborales</h2>
          <div className="overflow-x-auto">
            <DataTable
              columns={workExperiencesColumns}
              rows={workExperiences || []}
              actionButton={() => {}}
              onView={() => {}}
              actionButtonLabel="Ir a experiencias laborales"
              actionButtonIcon="lucide:briefcase"
            />
          </div>
        </div>
        <div className="flex flex-col w-full space-y-4">
          <h2 className="text-lg font-medium">Proyectos</h2>
          <div className="overflow-x-auto">
            <DataTable
              columns={projectsColumns}
              rows={projects || []}
              actionButton={() => {}}
              onView={() => {}}
              actionButtonLabel="Ir a proyectos"
              actionButtonIcon="lucide:folder"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
