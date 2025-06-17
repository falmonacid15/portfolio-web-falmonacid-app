import { useMutation, useQuery } from "@tanstack/react-query";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import { skillCategoriesColumns } from "../../constants/columns/SkillCategories";
import api from "../../lib/axios";
import FormModal from "../../components/ui/modals/FormModal";
import SkillCategoryForm from "../../components/forms/SkillCategoryForm";
import { addToast, useDisclosure } from "@heroui/react";
import { SkillCategory } from "../../interfaces/models/SkillCategory";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "../../components/ui/modals/ConfirmModal";

interface SkillCategoryResponse {
  data: SkillCategory[];
  total: number;
  page: number;
  limit: number;
}

export default function SkillCategoryPage() {
  const [page, setPage] = useState(1);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<
    string | null
  >(null);
  const [skillCategoryToDelete, setSkillCategoryToDelete] = useState<
    string | null
  >(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  const skillCategoryDisclosure = useDisclosure();
  const confirmModalDisclosure = useDisclosure();

  const {
    data: skillCategories,
    isLoading: isLoadingSkillCategories,
    refetch,
  } = useQuery({
    queryKey: ["skill-categories", page],
    queryFn: async () => {
      const res = await api.get<SkillCategoryResponse>(
        `/skill-category?page=${page}`
      );

      return res.data;
    },
  });

  const deleteSkillCategoryMutation = useMutation({
    mutationKey: ["delete-skill-category"],
    mutationFn: async (id: string) => {
      const res = await api.delete(`/skill-category/${id}`);

      return res.data;
    },
    onSuccess: () => {
      refetch();
      addToast({
        title: "Categoría de habilidad eliminada",
        description: "La categoría de habilidad se ha eliminado correctamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al eliminar categoría de habilidad",
        description:
          "La categoría de habilidad no se ha eliminado correctamente",
        color: "danger",
      });
    },
  });

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleAddSkillCategory = () => {
    skillCategoryDisclosure.onOpenChange();
  };

  const handleEditSkillCategory = (skillCategory: SkillCategory) => {
    setSelectedSkillCategory(skillCategory.id);
    skillCategoryDisclosure.onOpenChange();
  };

  const handleDeleteSkillCategory = (skillCategory: SkillCategory) => {
    setSkillCategoryToDelete(skillCategory.id);
    confirmModalDisclosure.onOpenChange();
  };

  const handleConfirmDeleteSkillCategory = () => {
    if (skillCategoryToDelete) {
      deleteSkillCategoryMutation.mutate(skillCategoryToDelete as string);
      setSkillCategoryToDelete(null);
      confirmModalDisclosure.onOpenChange();
    }
  };

  useEffect(() => {
    if (!skillCategoryDisclosure.isOpen && selectedSkillCategory) {
      setSelectedSkillCategory(null);
    }
  }, [skillCategoryDisclosure.isOpen, selectedSkillCategory]);

  return (
    <div>
      <HeaderPage
        title="Categorías de habilidades"
        description="Gestiona desde aquí las categorías de habilidades de tu portafolio."
      />
      <FormModal
        key="skill-category"
        title="Nueva categoría de habilidad"
        isOpen={skillCategoryDisclosure.isOpen}
        onOpenChange={skillCategoryDisclosure.onOpenChange}
        formRef={formRef}
      >
        <SkillCategoryForm
          skillCategoryId={selectedSkillCategory}
          onOpenChange={skillCategoryDisclosure.onOpenChange}
          formRef={formRef}
          reFetch={refetch}
        />
      </FormModal>
      <ConfirmModal
        key="delete-skill-category"
        title="¿Estas seguro que deseas eliminar este registro?"
        message="Esta acción no se puede deshacer"
        isOpen={confirmModalDisclosure.isOpen}
        onOpenChange={confirmModalDisclosure.onOpenChange}
        onConfirm={handleConfirmDeleteSkillCategory}
        isLoading={deleteSkillCategoryMutation.isPending}
      />
      <div className="mt-8">
        <DataTable
          key="skill-category-table"
          columns={skillCategoriesColumns}
          rows={skillCategories?.data || []}
          itemsPerPage={skillCategories?.limit || 0}
          totalCount={skillCategories?.total || 0}
          page={page}
          onPageChange={handleChangePage}
          actionButton={handleAddSkillCategory}
          actionButtonLabel="Nueva categoría de habilidad"
          onEdit={handleEditSkillCategory}
          onDelete={handleDeleteSkillCategory}
          isLoading={isLoadingSkillCategories}
        />
      </div>
    </div>
  );
}
