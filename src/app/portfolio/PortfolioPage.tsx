import { useQuery } from "@tanstack/react-query";
import PortfolioPageForm from "../../components/forms/PortfolioPageForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import api from "../../lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const projectsColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  {
    key: "shortDescription" as const,
    label: "DESCRIPCION CORTA",
  },
  {
    key: "mainImage" as const,
    label: "IMAGEN PRINCIPAL",
  },
  {
    key: "isFeatured" as const,
    label: "PROYECTO DESTACADO",
  },
  {
    key: "hasDemo" as const,
    label: "DEMO",
  },
  {
    key: "hasRepo" as const,
    label: "CODIGO FUENTE",
  },
  {
    key: "isActive" as const,
    label: "ACTIVO",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

export default function PortfolioPage() {
  const [page, setPage] = useState<number>(1);

  const route = useNavigate();

  const { data: projects, isLoading: projectsIsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data;
    },
  });

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleActionButton = () => {
    route("/admin/projects");
  };

  return (
    <div className="flex flex-col space-y-8">
      <HeaderPage
        title="Pagina Portafolio de proyectos"
        description="Controla desde aquí todo el contenido de la pagina proyectos de tu portafolio."
      />
      <div className="flex flex-col">
        <h1>Seccion de proyectos</h1>
        <PortfolioPageForm />
      </div>
      <div className="flex flex-col space-y-4">
        <h1>Proyectos</h1>
        <DataTable
          key="portfolio-projects"
          columns={projectsColumns}
          rows={projects?.data || []}
          totalCount={projects?.total || 0}
          isLoading={projectsIsLoading}
          page={page}
          onPageChange={handleChangePage}
          squareImages
          itemsPerPage={10}
          actionButton={handleActionButton}
          actionButtonLabel="Ir a ver todos los proyectos"
          actionButtonIcon="lucide:folder"
        />
      </div>
    </div>
  );
}
