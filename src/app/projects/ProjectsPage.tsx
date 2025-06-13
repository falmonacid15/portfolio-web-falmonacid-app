import { useMutation, useQuery } from "@tanstack/react-query";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import api from "../../lib/axios";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Project } from "../../interfaces/models/Project";
import FormModal from "../../components/ui/modals/FormModal";
import ProjectForm from "../../components/forms/ProjectForm";
import { addToast, useDisclosure } from "@heroui/react";
import { PaginationMeta } from "../../interfaces/pagination";
import ConfirmModal from "../../components/ui/modals/ConfirmModal";

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
    label: "CÓDIGO",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [deleteProject, setDeleteProject] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const projectModalDisclosure = useDisclosure();
  const confirmModalDisclosure = useDisclosure();

  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    data: projects,
    isLoading: projectsIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["projects", page, debouncedSearch],
    queryFn: async () => {
      const res = await api.get<{
        data: Project[];
        meta: PaginationMeta;
      }>(`/projects?page=${page}`);
      return res.data;
    },
  });

  const deleteProjectMutation = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async (projectId: string) => {
      const res = await api.delete(`/projects/${projectId}`);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Proyecto eliminado",
        description: "El proyecto se eliminó correctamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al eliminar el proyecto",
        description: "Ocurrió un error al eliminar el proyecto",
        color: "danger",
      });
    },
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleAddProject = () => {
    projectModalDisclosure.onOpenChange();
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project.id);
    projectModalDisclosure.onOpenChange();
  };

  const handleDeleteProject = (project: Project) => {
    setDeleteProject(project.id);
    confirmModalDisclosure.onOpenChange();
  };

  const handleConfirmDeleteProject = async () => {
    if (!deleteProject) return;
    await deleteProjectMutation.mutateAsync(deleteProject);
    refetch();
    confirmModalDisclosure.onOpenChange();
    setDeleteProject(null);
  };

  useEffect(() => {
    if (!projectModalDisclosure.isOpen && selectedProject) {
      setSelectedProject(null);
    }
  }, [projectModalDisclosure.isOpen]);

  return (
    <div className="flex flex-col w-full space-y-8">
      <HeaderPage
        title="Mantenedor de proyectos"
        description="Gestiona desde aquí los proyectos de tu portafolio"
      />
      <FormModal
        title="Agregar proyecto"
        isOpen={projectModalDisclosure.isOpen}
        onOpenChange={projectModalDisclosure.onOpenChange}
        formRef={formRef}
        size="4xl"
      >
        <ProjectForm
          projectId={selectedProject}
          onOpenChange={projectModalDisclosure.onOpenChange}
          reFetch={refetch}
          formRef={formRef}
        />
      </FormModal>
      <ConfirmModal
        key="delete-project"
        title="¿Estás seguro de eliminar este proyecto?"
        message="Esta acción no se puede deshacer"
        isOpen={confirmModalDisclosure.isOpen}
        onOpenChange={confirmModalDisclosure.onOpenChange}
        onConfirm={handleConfirmDeleteProject}
        isLoading={deleteProjectMutation.isPending}
      />
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
          itemsPerPage={10}
          totalCount={projects?.meta.totalCount || 0}
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
