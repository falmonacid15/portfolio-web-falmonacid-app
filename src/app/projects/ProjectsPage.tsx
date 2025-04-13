import { useQuery } from "@tanstack/react-query";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import api from "../../lib/axios";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Project } from "../../interfaces/models/Project";
import FormModal from "../../components/ui/modals/FormModal";
import ProjectForm from "../../components/forms/ProjectForm";
import { useDisclosure } from "@heroui/react";
import { CreateProjectInput } from "../../schemas/ProjectSchema";

const projectsColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  {
    key: "shortDescription" as const,
    label: "DESCRIPCIÓN",
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
    label: "CODIGO",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const projectModalDisclosure = useDisclosure();

  const {
    data: projects,
    isLoading: projectsIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["projects", page, debouncedSearch],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data;
    },
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleAddProject = () => {
    projectModalDisclosure.onOpenChange();
  };

  const handleEditProject = (project: Project) => {
    console.log("edit project", project.id);
  };

  const handleDeleteProject = (project: Project) => {
    console.log("delete project", project.id);
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      <HeaderPage
        title="Mantenedor de proyectos"
        description="Gestiona desde aqui los proyectos de tu portafolio"
      />
      <FormModal
        isOpen={projectModalDisclosure.isOpen}
        onOpenChange={projectModalDisclosure.onOpenChange}
        title="Projecto"
      >
        <ProjectForm
          onSuccess={() => {
            projectModalDisclosure.onOpenChange();
            refetch();
          }}
        />
      </FormModal>
      <div>
        <DataTable<Project>
          key="projects"
          columns={projectsColumns}
          rows={projects?.data || []}
          isLoading={projectsIsLoading}
          searchable
          setSearchQuery={setSearch}
          searchQuery={search}
          onPageChange={handlePageChange}
          page={page}
          itemsPerPage={projects?.itemsPerPage || 10}
          totalCount={projects?.total || 0}
          actionButton={handleAddProject}
          actionButtonLabel="Agregar proyecto"
          onDelete={handleDeleteProject}
          onEdit={handleEditProject}
          squareImages
        />
      </div>
    </div>
  );
}
