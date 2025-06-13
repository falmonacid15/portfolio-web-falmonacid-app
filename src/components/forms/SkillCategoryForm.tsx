import { addToast, Input, Select, SelectItem, Textarea } from "@heroui/react";
import useFormStore from "../../store/formStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Home } from "../../interfaces/models/Home";
import { useForm } from "react-hook-form";
import {
  SkillCategoryInputs,
  skillCategorySchema,
} from "../../schemas/SkillCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutMe } from "../../interfaces/models/Aboutme";
import { useEffect } from "react";

interface SkillCategoryFormProps {
  skillCategoryId: string | null;
  onOpenChange: (open: boolean) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  reFetch: () => void;
}

export default function SkillCategoryForm({
  skillCategoryId,
  formRef,
  onOpenChange,
  reFetch,
}: SkillCategoryFormProps) {
  const { setFormSubmitted } = useFormStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillCategoryInputs>({
    resolver: zodResolver(skillCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      aboutMeId: "",
    },
  });

  const { data: homes, isLoading } = useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      const res = await api.get<{
        data: AboutMe[];
        meta: {};
      }>("/aboutme");
      return res.data;
    },
  });

  const { data: selectedSkillCategory } = useQuery({
    queryKey: ["skill-category", skillCategoryId],
    queryFn: async () => {
      const res = await api.get(`/skill-category/${skillCategoryId}`);
      return res.data;
    },
    enabled: !!skillCategoryId,
  });

  const createSkillCategoryMutation = useMutation({
    mutationKey: ["create-skill-category"],
    mutationFn: async (data: SkillCategoryInputs) => {
      const res = await api.post("/skill-category", data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Categoría de habilidad creada",
        description: "La categoría de habilidad se creó correctamente",
        color: "success",
      });
      onOpenChange(false);
      reFetch();
    },
    onError: () => {
      addToast({
        title: "Error al crear la categoría de habilidad",
        description: "La categoría de habilidad no se pudo crear",
        color: "danger",
      });
    },
  });

  const updateSkillCategoryMutation = useMutation({
    mutationKey: ["update-skill-category"],
    mutationFn: async (data: SkillCategoryInputs) => {
      const res = await api.patch(`/skill-category/${skillCategoryId}`, data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Categoría de habilidad actualizada",
        description: "La categoría de habilidad se actualizó correctamente",
        color: "success",
      });
      onOpenChange(false);
      reFetch();
    },
    onError: () => {
      addToast({
        title: "Error al actualizar la categoría de habilidad",
        description: "La categoría de habilidad no se pudo actualizar",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data: SkillCategoryInputs) => {
    setFormSubmitted(true);
    try {
      if (skillCategoryId) {
        await updateSkillCategoryMutation.mutateAsync(data);
      } else {
        await createSkillCategoryMutation.mutateAsync(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFormSubmitted(false);
    }
  };

  useEffect(() => {
    if (selectedSkillCategory) {
      setValue("name", selectedSkillCategory.name);
      setValue("description", selectedSkillCategory.description);
      setValue("aboutMeId", selectedSkillCategory.aboutMeId);
    }
  }, [selectedSkillCategory, setValue]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <Input
        labelPlacement="outside"
        size="lg"
        label="Nombre"
        placeholder="Ingrese el nombre de la categoría"
        variant="faded"
        value={watch("name")}
        {...register("name")}
      />
      <Textarea
        labelPlacement="outside"
        size="lg"
        label="Descripción"
        placeholder="Ingrese la descripción de la categoría"
        variant="faded"
        value={watch("description")}
        {...register("description")}
      />
      <Select
        items={homes?.data || []}
        labelPlacement="outside"
        size="lg"
        label="Pagina de sobre mi"
        placeholder="Seleccione la pagina de sobre mi"
        variant="faded"
        value={watch("aboutMeId")}
        {...register("aboutMeId")}
      >
        {(item) => <SelectItem key={item.id}>{item.title}</SelectItem>}
      </Select>
    </form>
  );
}
