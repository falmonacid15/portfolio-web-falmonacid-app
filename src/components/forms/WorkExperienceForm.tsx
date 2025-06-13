import { addToast, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  WorkExperienceInputs,
  workExperienceSchema,
} from "../../schemas/WorkExperienceSchema";
import api from "../../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Home } from "../../interfaces/models/Home";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationMeta } from "../../interfaces/pagination";

interface WorkExperienceFormProps {
  workExperienceId: string | null;
  onOpenChange: (open: boolean) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  reFetch: () => void;
}

export default function WorkExperienceForm({
  workExperienceId,
  formRef,
  onOpenChange,
  reFetch,
}: WorkExperienceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkExperienceInputs>({
    defaultValues: {
      title: "",
      dateRange: "",
      description: "",
      homeId: "",
    },
    resolver: zodResolver(workExperienceSchema),
  });

  const { data: homes, isLoading: homesIsLoading } = useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      const res = await api.get<{
        data: Home[];
        meta: PaginationMeta;
      }>("/home");

      return res.data;
    },
  });

  const {
    data: selectedWorkExperience,
    isLoading: selectedWorkExperienceIsLoading,
  } = useQuery({
    queryKey: ["work-experience", workExperienceId],
    queryFn: async () => {
      const res = await api.get<WorkExperienceInputs>(
        `/work-experience/${workExperienceId}`
      );

      return res.data;
    },
    enabled: !!workExperienceId,
  });

  const createWorkExperienceMutation = useMutation({
    mutationKey: ["create-work-experience"],
    mutationFn: async (data: WorkExperienceInputs) => {
      const res = await api.post("/work-experience", data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Experiencia laboral creada",
        description: "La experiencia laboral se ha creado correctamente",
        color: "success",
      });
      reFetch();
      onOpenChange(false);
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Ha ocurrido un error al crear la experiencia laboral",
        color: "danger",
      });
    },
  });

  const updateWorkExperienceMutation = useMutation({
    mutationKey: ["update-work-experience"],
    mutationFn: async (data: WorkExperienceInputs) => {
      const res = await api.patch(`/work-experience/${workExperienceId}`, data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Experiencia laboral actualizada",
        description: "La experiencia laboral se ha actualizado correctamente",
        color: "success",
      });
      reFetch();
      onOpenChange(false);
    },
    onError: () => {
      addToast({
        title: "Error",
        description:
          "Ha ocurrido un error al actualizar la experiencia laboral",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data: WorkExperienceInputs) => {
    if (workExperienceId) {
      await updateWorkExperienceMutation.mutateAsync(data);
    } else {
      await createWorkExperienceMutation.mutateAsync(data);
    }
  };

  useEffect(() => {
    if (selectedWorkExperience) {
      setValue("title", selectedWorkExperience.title);
      setValue("dateRange", selectedWorkExperience.dateRange);
      setValue("description", selectedWorkExperience.description);
      setValue("homeId", selectedWorkExperience.homeId);
    }
  }, [selectedWorkExperience, setValue]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <Input
        label="Título"
        placeholder="Ingrese titulo de la experiencia laboral"
        labelPlacement="outside"
        variant="faded"
        isDisabled={selectedWorkExperienceIsLoading}
        isInvalid={!!errors.title}
        errorMessage={errors.title?.message}
        value={watch("title")}
        {...register("title")}
      />
      <Input
        label="Rango de fechas"
        placeholder="Ingrese rango de fechas"
        labelPlacement="outside"
        variant="faded"
        isDisabled={selectedWorkExperienceIsLoading}
        isInvalid={!!errors.dateRange}
        errorMessage={errors.dateRange?.message}
        value={watch("dateRange")}
        {...register("dateRange")}
      />
      <Controller
        name="homeId"
        control={control}
        render={({ field }) => (
          <Select
            className="w-full"
            variant="faded"
            label="Home page"
            placeholder="Seleccione home page"
            labelPlacement="outside"
            isLoading={homesIsLoading}
            isDisabled={false}
            multiple={false}
            selectedKeys={field.value ? [field.value] : []}
            isInvalid={!!errors.homeId}
            errorMessage={errors.homeId?.message}
            items={homes?.data || []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0]?.toString() || "";
              field.onChange(selectedKey);
            }}
          >
            {(item) => (
              <SelectItem key={item.id}>{item.heroSubtitle}</SelectItem>
            )}
          </Select>
        )}
      />
      <Textarea
        label="Descripción"
        placeholder="Ingrese descripción de la experiencia laboral"
        labelPlacement="outside"
        variant="faded"
        isDisabled={selectedWorkExperienceIsLoading}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        value={watch("description")}
        {...register("description")}
      />
    </form>
  );
}
