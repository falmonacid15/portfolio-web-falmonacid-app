import { addToast, useDisclosure } from "@heroui/react";
import WorkExperienceForm from "../../components/forms/WorkExperienceForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import FormModal from "../../components/ui/modals/FormModal";
import { WorkExperience } from "../../interfaces/models/WorkExperience";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useEffect, useState } from "react";
import ConfirmModal from "../../components/ui/modals/ConfirmModal";

const workExperiencesColumns = [
  {
    key: "title" as const,
    label: "TITULO",
  },
  {
    key: "dateRange" as const,
    label: "RANGO DE FECHAS",
  },
  {
    key: "description" as const,
    label: "DESCRIPCIÓN",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

interface WorkExperienceResponse {
  data: WorkExperience[];
  itemsPerPage: number;
  total: number;
}

export default function WorkExperiencePage() {
  const [page, setPage] = useState(1);
  const [selectedWorkExperience, setSelectedWorkExperience] = useState<
    string | null
  >(null);
  const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);

  const workExperiencesDisclosure = useDisclosure();
  const confirmModalDisclosure = useDisclosure();

  const handleActionDataTable = () => {
    workExperiencesDisclosure.onOpenChange();
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleEditWorkExperience = (workExperience: WorkExperience) => {
    setSelectedWorkExperience(workExperience.id);
    workExperiencesDisclosure.onOpenChange();
  };

  const handleDeleteWorkExperience = (workExperience: WorkExperience) => {
    setSelectedToDelete(workExperience.id);
    confirmModalDisclosure.onOpenChange();
  };

  const handleConfirmDeleteWorkExperience = () => {
    if (selectedToDelete) {
      deleteWorkExperienceMutation.mutate(selectedToDelete);
      setSelectedToDelete(null);
      confirmModalDisclosure.onOpenChange();
    }
  };

  const {
    data: workExperiences,
    isLoading: workExperiencesIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["work-experiences", page],
    queryFn: async () => {
      const res = await api.get<WorkExperienceResponse>("/work-experiences");

      return res.data;
    },
  });

  const deleteWorkExperienceMutation = useMutation({
    mutationFn: async (workExperienceId: string) => {
      const res = await api.delete(`/work-experiences/${workExperienceId}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
      addToast({
        title: "Experiencia laboral eliminada",
        description: "La experiencia laboral se ha eliminado correctamente",
        color: "success",
      });
    },
    onError: () => {},
  });

  useEffect(() => {
    if (!workExperiencesDisclosure.isOpen && selectedWorkExperience) {
      setSelectedWorkExperience(null);
    }
  }, [selectedWorkExperience, workExperiencesDisclosure.isOpen]);

  return (
    <div className="flex flex-col">
      <HeaderPage
        title="Mantenedor de experiencias laborales"
        description="Gestiona desde aqui las experiencias laborales de tu portafolio."
      />
      <FormModal
        key="work-experiences"
        title="Nueva experiencia laboral"
        isOpen={workExperiencesDisclosure.isOpen}
        onOpenChange={workExperiencesDisclosure.onOpenChange}
      >
        <WorkExperienceForm
          onSuccess={() => {
            workExperiencesDisclosure.onOpenChange();
            refetch();
          }}
          workExperienceId={selectedWorkExperience}
        />
      </FormModal>
      <ConfirmModal
        key="delete-work-experience"
        title="¿Estas seguro de eliminar esta experiencia laboral?"
        message="esta acción no se puede deshacer"
        isOpen={confirmModalDisclosure.isOpen}
        onOpenChange={confirmModalDisclosure.onOpenChange}
        onConfirm={handleConfirmDeleteWorkExperience}
        isLoading={deleteWorkExperienceMutation.isPending}
      />
      <div className="mt-8">
        <DataTable<WorkExperience>
          key="work-experiences"
          columns={workExperiencesColumns}
          rows={workExperiences?.data || []}
          itemsPerPage={workExperiences?.itemsPerPage || 10}
          totalCount={workExperiences?.total || 0}
          onPageChange={handleChangePage}
          page={page}
          isLoading={workExperiencesIsLoading}
          actionButton={handleActionDataTable}
          actionButtonLabel="Agregar experiencia laboral"
          onEdit={handleEditWorkExperience}
          onDelete={handleDeleteWorkExperience}
          squareImages
        />
      </div>
    </div>
  );
}
