import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { SkillCategory } from "../../interfaces/models/SkillCategory";
import { useForm } from "react-hook-form";
import { SkillInputs, skillSchema } from "../../schemas/SkillSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormStore from "../../store/formStore";
import { useEffect } from "react";

interface SkillFormProps {
  skillId: string | null;
  onOpenChange: (open: boolean) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  reFetch: () => void;
}
export default function SkillForm({
  skillId,
  formRef,
  onOpenChange,
  reFetch,
}: SkillFormProps) {
  const { setFormSubmitted } = useFormStore();

  const { register, watch, setValue, handleSubmit } = useForm<SkillInputs>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      icon: "",
      categoryId: "",
    },
    mode: "onSubmit",
  });

  const { data: skillCategories, isLoading } = useQuery({
    queryKey: ["skill-categories"],
    queryFn: async () => {
      const res = await api.get<{
        data: SkillCategory[];
      }>("/skill-category");
      return res.data;
    },
  });

  const { data: selectedSkill } = useQuery({
    queryKey: ["skill", skillId],
    queryFn: async () => {
      const res = await api.get(`/skill/${skillId}`);
      return res.data;
    },
    enabled: !!skillId,
  });

  const createSkillMutation = useMutation({
    mutationKey: ["create-skill"],
    mutationFn: async (data: SkillInputs) => {
      const res = await api.post("/skill", data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Habilidad creada",
        description: "La habilidad se ha creado correctamente",
        color: "success",
      });
      reFetch();
      onOpenChange(false);
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Ha ocurrido un error al crear la habilidad",
        color: "danger",
      });
    },
  });

  const updateSkillMutation = useMutation({
    mutationKey: ["update-skill"],
    mutationFn: async (data: SkillInputs) => {
      const res = await api.patch(`/skill/${skillId}`, data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Habilidad actualizada",
        description: "La habilidad se ha actualizado correctamente",
        color: "success",
      });
      reFetch();
      onOpenChange(false);
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar la habilidad",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data: SkillInputs) => {
    setFormSubmitted(true);
    try {
      if (skillId) {
        await updateSkillMutation.mutateAsync(data);
      } else {
        await createSkillMutation.mutateAsync(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFormSubmitted(false);
    }
  };

  useEffect(() => {
    if (selectedSkill) {
      setValue("name", selectedSkill.name);
      setValue("icon", selectedSkill.icon);
      setValue("categoryId", selectedSkill.categoryId);
    }
  }, [selectedSkill]);
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
        placeholder="Ingrese el nombre de la habilidad"
        variant="faded"
        value={watch("name")}
        {...register("name")}
      />
      <Input
        labelPlacement="outside"
        size="lg"
        label="Icono"
        placeholder="Ingrese el icono de la habilidad"
        variant="faded"
        value={watch("icon")}
        {...register("icon")}
      />
      <Select
        items={skillCategories?.data || []}
        isLoading={isLoading}
        labelPlacement="outside"
        size="lg"
        label="Categoría"
        placeholder="Seleccione la categoría de la habilidad"
        variant="faded"
        value={watch("categoryId")}
        {...register("categoryId")}
      >
        {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
      </Select>
    </form>
  );
}
