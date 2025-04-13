import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SkillCategoryInputs,
  skillCategorySchema,
} from "../../schemas/SkillCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { AboutMe } from "../../interfaces/models/Aboutme";

interface SkillCategoryFormProps {
  onSuccess?: () => void;
  skillCategoryId: string | null;
}

interface AboutMeReponse {
  data: AboutMe[];
  total: number;
  page: number;
}
const SkillCategoryForm = forwardRef<
  { submit: () => Promise<boolean> },
  SkillCategoryFormProps
>(({ onSuccess, skillCategoryId }, ref) => {
  useImperativeHandle(ref, () => ({
    submit: async () => {
      const isValid = await trigger();
      if (isValid) {
        return handleSubmit(onSubmit)();
      }
      console.log("Form validation failed", errors);
      return false;
    },
  }));

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillCategoryInputs>({
    defaultValues: {
      name: "",
      description: "",
      aboutMeId: "",
    },
    resolver: zodResolver(skillCategorySchema),
  });

  const { data: aboutMeData, isLoading: aboutMeIsLoading } = useQuery({
    queryKey: ["about-me"],
    queryFn: async () => {
      const res = await api.get<AboutMeReponse>("/aboutme");
      return res.data;
    },
  });

  const { data: skillCategoryData, isLoading: skillCategoryIsLoading } =
    useQuery({
      queryKey: ["skill-categories", skillCategoryId],
      queryFn: async () => {
        const res = await api.get(`/skill-categories/${skillCategoryId}`);
        return res.data;
      },
      enabled: !!skillCategoryId,
    });

  const createSkillCategoryMutation = useMutation({
    mutationFn: async (data: SkillCategoryInputs) => {
      const res = await api.post("/skill-categories", data);
      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      addToast({
        title: "Categoría de habilidad creada",
        description: "La categoría de habilidad se creó correctamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al crear categoría de habilidad",
        description: "La categoría de habilidad no se creó correctamente",
        color: "danger",
      });
    },
  });

  const updateSkillCategoryMutation = useMutation({
    mutationFn: async (data: SkillCategoryInputs) => {
      const res = await api.patch(`/skill-categories/${skillCategoryId}`, data);
      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      addToast({
        title: "Categoría de habilidad actualizada",
        description: "La categoría de habilidad se actualizó correctamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al actualizar categoría de habilidad",
        description: "La categoría de habilidad no se actualizó correctamente",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data: SkillCategoryInputs) => {
    if (skillCategoryId) {
      updateSkillCategoryMutation.mutate(data);
    } else {
      createSkillCategoryMutation.mutate(data);
      console.log(data);
    }
  };

  useEffect(() => {
    if (skillCategoryData) {
      setValue("name", skillCategoryData.name);
      setValue("description", skillCategoryData.description);
      setValue("aboutMeId", skillCategoryData.aboutMeId);
    }
  }, [skillCategoryId, setValue, skillCategoryData]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Título"
        placeholder="Ingrese titulo de la experiencia laboral"
        labelPlacement="outside"
        variant="faded"
        isDisabled={skillCategoryIsLoading}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        value={watch("name")}
        {...register("name")}
      />
      <Textarea
        label="Descripción"
        placeholder="Ingrese descripción de la experiencia laboral"
        labelPlacement="outside"
        variant="faded"
        isDisabled={skillCategoryIsLoading}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        value={watch("description")}
        {...register("description")}
      />
      <Controller
        name="aboutMeId"
        control={control}
        render={({ field }) => (
          <Select
            className="w-full"
            variant="faded"
            label="Home page"
            placeholder="Seleccione home page"
            labelPlacement="outside"
            isLoading={aboutMeIsLoading}
            isDisabled={skillCategoryIsLoading}
            multiple={false}
            selectedKeys={field.value ? [field.value] : []}
            isInvalid={!!errors.aboutMeId}
            errorMessage={errors.aboutMeId?.message}
            items={aboutMeData?.data || []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0]?.toString() || "";
              field.onChange(selectedKey);
            }}
          >
            {(item) => <SelectItem key={item.id}>{item.title}</SelectItem>}
          </Select>
        )}
      />
    </form>
  );
});

export default SkillCategoryForm;
