import { useQuery } from "@tanstack/react-query";
import AboutmePageForm from "../../components/forms/AboutmePageForm";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import api from "../../lib/axios";

const skillsCategoriesColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  { key: "description" as const, label: "DESCRIPCION" },
  { key: "actions" as const, label: "ACCIONES" },
];

const skillsColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  { key: "icon" as const, label: "ICONO" },
  { key: "actions" as const, label: "ACCIONES" },
];

export default function AboutMePage() {
  const handleOnViewSkill = () => {};
  const handleOnViewSkillCategory = () => {};

  const handleNavigateToSkills = () => {};
  const handleNavigateToSkillsCategories = () => {};

  const { data: skillsCategories, isLoading: isLoadingSkillsCategories } =
    useQuery({
      queryKey: ["skillsCategories"],
      queryFn: async () => {
        const res = await api.get("/skill-categories");
        return res.data;
      },
    });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await api.get("/skills");
      return res.data.data.data;
    },
  });

  return (
    <div className="flex flex-col space-y-8">
      <HeaderPage
        title="Pagina Sobre mi"
        description="Controla desde aquí todo el contenido de la pagina sobre mi de tu portafolio."
      />
      <div className="flex flex-col">
        <AboutmePageForm />
      </div>
      <h1 className="text-xl font-bold mb-8 mt-8">
        Mantenedores de habilidades
      </h1>
      <div className="flex justify-between space-x-8">
        <div className="flex flex-col space-y-2">
          <h1>Categorias de habilidades</h1>
          <DataTable
            key="skillsCategories"
            actionButton={handleNavigateToSkillsCategories}
            actionButtonLabel="Ir a categorias de habilidades"
            actionButtonIcon="lucide:tag"
            onView={handleOnViewSkillCategory}
            columns={skillsCategoriesColumns}
            rows={skillsCategories || []}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <h1>Habilidades</h1>
          <DataTable
            key="skills"
            actionButton={handleNavigateToSkills}
            actionButtonLabel="Ir a habilidades"
            actionButtonIcon="lucide:code-2"
            onView={handleOnViewSkill}
            columns={skillsColumns}
            rows={skills || []}
          />
        </div>
      </div>
    </div>
  );
}
