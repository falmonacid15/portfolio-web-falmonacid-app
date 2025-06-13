import { RefObject, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CreateProjectInput,
  createProjectSchema,
} from "../../schemas/ProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addToast,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { DynamicTextInput } from "../ui/DynamicTextInput";
import { ImageDropzone } from "../ui/ImageDropzone";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Home } from "../../interfaces/models/Home";
import { Portfolio } from "../../interfaces/models/Portfolio";
import useFormStore from "../../store/formStore";
import { Project } from "../../interfaces/models/Project";

interface ProjectFormProps {
  projectId: string | null;
  onOpenChange: (open: boolean) => void;
  formRef: RefObject<HTMLFormElement | null>;
  reFetch: () => void;
}

export default function ProjectForm({
  projectId,
  onOpenChange,
  formRef,
  reFetch,
}: ProjectFormProps) {
  const { setFormSubmitted } = useFormStore();

  const { register, control, watch, handleSubmit, setValue } =
    useForm<CreateProjectInput>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
        name: "",
        shortDescription: "",
        mainImage: "",
        isFeatured: false,
        hasRepo: false,
        demoUrl: "",
        hasDemo: false,
        homeId: "",
        images: [],
        isActive: true,
        languages: [],
        longDescription: "",
        portfolioId: "",
        repositoryUrl: "",
        technologies: [],
      },
    });

  const { data: selectedProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await api.get<Project>(`/projects/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });

  const { data: home } = useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      const res = await api.get<{
        data: Home[];
        meta: {
          totalCount: number;
        };
      }>("/home");
      return res.data;
    },
  });

  const { data: portfolio } = useQuery({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const res = await api.get<{
        data: Portfolio[];
        meta: {
          totalCount: number;
        };
      }>("/portfolio");
      return res.data;
    },
  });

  const createProjectMutation = useMutation({
    mutationKey: ["createProject"],
    mutationFn: async (data: CreateProjectInput) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("shortDescription", data.shortDescription);
      formData.append("longDescription", data.longDescription);
      formData.append("isActive", data.isActive.toString());
      formData.append("portfolioId", data.portfolioId);
      formData.append("isFeatured", data.isFeatured.toString());
      formData.append("hasRepo", data.hasRepo.toString());
      formData.append("hasDemo", data.hasDemo.toString());
      formData.append("demoUrl", data.demoUrl || "");
      formData.append("repositoryUrl", data.repositoryUrl || "");
      if (data.homeId) {
        formData.append("homeId", data.homeId);
      }

      formData.append("mainImage", data.mainImage);

      Array.from(data.images).forEach((file: any) => {
        formData.append("images", file);
      });

      data.technologies.forEach((tech: string) => {
        formData.append("technologies", tech);
      });

      data.languages.forEach((lang: string) => {
        formData.append("languages", lang);
      });

      const res = await api.post("/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Proyecto creado",
        description: "El proyecto se creo correctamente",
        color: "success",
      });
      reFetch();
      onOpenChange(false);
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Hubo un error al crear el proyecto",
        color: "danger",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationKey: ["updateProject"],
    mutationFn: async (data: CreateProjectInput) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("shortDescription", data.shortDescription);
      formData.append("longDescription", data.longDescription);
      formData.append("isActive", data.isActive.toString());
      formData.append("portfolioId", data.portfolioId);
      formData.append("isFeatured", data.isFeatured.toString());
      formData.append("hasRepo", data.hasRepo.toString());
      formData.append("hasDemo", data.hasDemo.toString());
      formData.append("demoUrl", data.demoUrl || "");
      formData.append("repositoryUrl", data.repositoryUrl || "");
      if (data.homeId) {
        formData.append("homeId", data.homeId);
      }

      if (data.mainImage instanceof File) {
        formData.append("mainImage", data.mainImage);
      }

      if (data.images instanceof Array) {
        Array.from(data.images).forEach((file: any) => {
          formData.append("images", file);
        });
      }

      data.technologies.forEach((tech: string) => {
        formData.append("technologies", tech);
      });

      data.languages.forEach((lang: string) => {
        formData.append("languages", lang);
      });

      const res = await api.patch(`/projects/${projectId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
  });

  const onSubmit = async (data: CreateProjectInput) => {
    setFormSubmitted(true);
    console.log(data);
    try {
      if (projectId) {
        await updateProjectMutation.mutateAsync(data);
      } else {
        await createProjectMutation.mutateAsync(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFormSubmitted(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      setValue("name", selectedProject.name);
      setValue("shortDescription", selectedProject?.shortDescription || "");
      setValue("longDescription", selectedProject?.longDescription || "");
      setValue("isActive", selectedProject.isActive);
      setValue("portfolioId", selectedProject.portfolioId);
      setValue("isFeatured", selectedProject.isFeatured);
      setValue("hasRepo", selectedProject.hasRepo);
      setValue("hasDemo", selectedProject.hasDemo);
      setValue("demoUrl", selectedProject?.demoUrl || "");
      setValue("repositoryUrl", selectedProject?.repositoryUrl || "");
      setValue("homeId", selectedProject.homeId);
      setValue("technologies", selectedProject.technologies);
      setValue("languages", selectedProject.languages);
    }
  }, [selectedProject]);

  return (
    <form
      ref={formRef}
      className="flex gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 w-full">
        <Input
          labelPlacement="outside"
          size="lg"
          label="Nombre"
          placeholder="Ingrese el nombre del proyecto"
          variant="faded"
          value={watch("name")}
          {...register("name")}
        />
        <Textarea
          labelPlacement="outside"
          size="lg"
          label="Descripción corta"
          placeholder="Ingrese la descripción corta del proyecto"
          variant="faded"
          value={watch("shortDescription")}
          {...register("shortDescription")}
        />
        <Textarea
          labelPlacement="outside"
          size="lg"
          label="Descripción larga"
          placeholder="Ingrese la descripción larga del proyecto"
          variant="faded"
          value={watch("longDescription")}
          {...register("longDescription")}
        />
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="¿Esta activo?"
              orientation="horizontal"
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
            >
              <Radio value="true">Si</Radio>
              <Radio value="false">No</Radio>
            </RadioGroup>
          )}
        />
        <Select
          label="Portfolio"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Seleccione un portfolio"
          items={portfolio?.data || []}
          className="w-full"
          isLoading={!portfolio}
          selectedKeys={[watch("portfolioId") || ""]}
          {...register("portfolioId")}
        >
          {(item) => <SelectItem key={item.id}>{item.title}</SelectItem>}
        </Select>
        <div className="flex gap-4 w-full">
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="¿Es destacado?"
                orientation="horizontal"
                className="w-1/2"
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
              >
                <Radio value="true">Si</Radio>
                <Radio value="false">No</Radio>
              </RadioGroup>
            )}
          />
          <Select
            label="home"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Seleccione una home"
            selectedKeys={[watch("homeId") || ""]}
            isDisabled={watch("isFeatured") === false}
            items={home?.data || []}
            className="w-full"
            {...register("homeId")}
          >
            {(item) => <SelectItem key={item.id}>{item.heroTitle}</SelectItem>}
          </Select>
        </div>
        <div className="flex gap-4">
          <Controller
            name="hasRepo"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="¿Tiene repositorio?"
                orientation="horizontal"
                className="w-1/2"
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
              >
                <Radio value="true">Si</Radio>
                <Radio value="false">No</Radio>
              </RadioGroup>
            )}
          />
          <Input
            labelPlacement="outside"
            size="lg"
            label="URL repositorio"
            placeholder="Ingrese la URL del repositorio"
            variant="faded"
            className="w-full"
            value={watch("repositoryUrl")}
            isDisabled={watch("hasRepo") === false}
            {...register("repositoryUrl")}
          />
        </div>
        <div className="flex gap-4">
          <Controller
            name="hasDemo"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="¿Tiene demo?"
                orientation="horizontal"
                className="w-1/2"
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
              >
                <Radio value="true">Si</Radio>
                <Radio value="false">No</Radio>
              </RadioGroup>
            )}
          />
          <Input
            labelPlacement="outside"
            size="lg"
            label="URL de la demo"
            placeholder="Ingrese la URL de la demo"
            variant="faded"
            className="w-full"
            value={watch("demoUrl")}
            isDisabled={watch("hasDemo") === false}
            {...register("demoUrl")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <DynamicTextInput
          label="Tecnologías"
          buttonLabel="Agregar tecnología"
          typeInput="input"
          name="technologies"
          control={control}
          register={register}
        />
        <DynamicTextInput
          label="Lenguajes"
          buttonLabel="Agregar lenguaje"
          typeInput="input"
          name="languages"
          control={control}
          register={register}
        />
        <ImageDropzone
          key="mainImage"
          name="mainImage"
          control={control}
          multiple={false}
          label="Imagen principal"
          existingImages={selectedProject?.mainImage}
        />
        <ImageDropzone
          key="images"
          name="images"
          control={control}
          multiple={true}
          label="Imágenes"
          existingImages={selectedProject?.images}
        />
      </div>
    </form>
  );
}
