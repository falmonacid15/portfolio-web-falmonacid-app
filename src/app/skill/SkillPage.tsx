import { useEffect, useRef, useState } from "react";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import { addToast, useDisclosure } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import FormModal from "../../components/ui/modals/FormModal";
import SkillForm from "../../components/forms/SkillForm";
import { Skill } from "../../interfaces/models/Skill";
import ConfirmModal from "../../components/ui/modals/ConfirmModal";

const skillColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  {
    key: "category.name" as const,
    label: "CATEGORÍA",
  },
  {
    key: "icon" as const,
    label: "ÍCONO",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

export default function SkillPage() {
  const [page, setPage] = useState(1);

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  const skillModalDisclosure = useDisclosure();
  const deleteSkillModalDisclosure = useDisclosure();

  const {
    data: skills,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["skills", page],
    queryFn: async () => {
      const res = await api.get(`/skill?page=${page}&perPage=10`);
      return res.data;
    },
  });

  const deleteSkillMutation = useMutation({
    mutationKey: ["delete-skill"],
    mutationFn: async (skillId: string) => {
      const res = await api.delete(`/skill/${skillId}`);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Habilidad eliminada",
        description: "La habilidad se ha eliminado correctamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar la habilidad",
        color: "danger",
      });
    },
  });

  const handleAddSkill = () => {
    skillModalDisclosure.onOpenChange();
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill.id);
    skillModalDisclosure.onOpenChange();
  };

  const handleDeleteSkill = (skill: Skill) => {
    setSkillToDelete(skill.id);
    deleteSkillModalDisclosure.onOpenChange();
  };

  const handleConfirmDeleteSkill = async () => {
    if (skillToDelete) {
      await deleteSkillMutation.mutateAsync(skillToDelete);
      deleteSkillModalDisclosure.onOpenChange();
      refetch();
    }
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    if (!skillModalDisclosure.isOpen && selectedSkill) {
      setSelectedSkill(null);
    }
  }, [skillModalDisclosure.isOpen, selectedSkill]);

  return (
    <div>
      <HeaderPage
        title="Habilidades"
        description="Gestiona desde aquí las habilidades de tu portafolio."
      />
      <FormModal
        key="create-skill-modal"
        title={selectedSkill ? "Editar habilidad" : "Crear habilidad"}
        isOpen={skillModalDisclosure.isOpen}
        onOpenChange={skillModalDisclosure.onOpenChange}
        formRef={formRef}
      >
        <SkillForm
          skillId={selectedSkill}
          onOpenChange={skillModalDisclosure.onOpenChange}
          formRef={formRef}
          reFetch={refetch}
        />
      </FormModal>

      <ConfirmModal
        key="delete-skill-modal"
        title="Eliminar habilidad"
        message="¿Estás seguro de que quieres eliminar esta habilidad?"
        isOpen={deleteSkillModalDisclosure.isOpen}
        onOpenChange={deleteSkillModalDisclosure.onOpenChange}
        onConfirm={handleConfirmDeleteSkill}
        isLoading={deleteSkillMutation.isPending}
      />

      <div className="mt-8">
        <DataTable
          key="skill-table"
          columns={skillColumns}
          rows={skills?.data || []}
          actionButton={handleAddSkill}
          actionButtonLabel="Nueva habilidad"
          onEdit={handleEditSkill}
          onDelete={handleDeleteSkill}
          onPageChange={handleChangePage}
          totalCount={skills?.meta.totalCount || 0}
          itemsPerPage={10}
          page={page}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
