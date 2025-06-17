import { useQuery } from "@tanstack/react-query";
import HomePageForm from "../../components/forms/HomePageForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import api from "../../lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    label: "DESCRIPCIÓN",
  },
];

const projectsColumns = [
  {
    key: "name",
    label: "NOMBRE",
  },
  {
    key: "shortDescription",
    label: "DESCRIPCIÓN CORTA",
  },
  {
    key: "hasDemo",
    label: "¿TIENE DEMO?",
  },
  {
    key: "hasRepo",
    label: "¿TIENE CÓDIGO FUENTE?",
  },
];

export default function HomePage() {
  const [workExperiencePage, setWorkExperiencePage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);

  const router = useNavigate();

  const { data: workExperiences } = useQuery({
    queryKey: ["workExperiences", workExperiencePage],
    queryFn: async () => {
      const res = await api.get(`/work-experience?page=${workExperiencePage}`);
      return res.data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects", projectsPage],
    queryFn: async () => {
      const res = await api.get(`/projects?page=${projectsPage}`);
      return res.data;
    },
  });

  const handleWorkExperiencePageChange = (page: number) => {
    setWorkExperiencePage(page);
  };

  const handleProjectsPageChange = (page: number) => {
    setProjectsPage(page);
  };

  return (
    <div className="flex flex-col w-full">
      <HeaderPage
        title="Pagina Inicio"
        description="Controla desde aquí todo el contenido de la pagina de inicio de tu portafolio."
      />
      <HomePageForm />
      <div className="flex flex-col sm:flex-row w-full px-4 sm:px-16 mt-8 space-y-8 space-x-0 sm:space-y-0 sm:space-x-8">
        <div className="flex flex-col w-full space-y-4">
          <h2 className="text-lg font-medium">Experiencias laborales</h2>
          <div className="overflow-x-auto">
            <DataTable
              columns={workExperiencesColumns}
              rows={workExperiences?.data || []}
              actionButton={() => {
                router("/admin/work-experiences");
              }}
              actionButtonLabel="Ir a experiencias laborales"
              actionButtonIcon="lucide:briefcase"
              onPageChange={handleWorkExperiencePageChange}
              page={workExperiencePage}
              totalCount={workExperiences?.meta.totalCount || 0}
            />
          </div>
        </div>
        <div className="flex flex-col w-full space-y-4">
          <h2 className="text-lg font-medium">Proyectos</h2>
          <div className="overflow-x-auto">
            <DataTable
              columns={projectsColumns}
              rows={projects?.data || []}
              actionButton={() => {
                router("/admin/projects");
              }}
              actionButtonLabel="Ir a proyectos"
              actionButtonIcon="lucide:folder"
              onPageChange={handleProjectsPageChange}
              page={projectsPage}
              totalCount={projects?.meta.totalCount || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
