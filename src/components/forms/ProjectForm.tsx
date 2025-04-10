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
import { Controller, useForm } from "react-hook-form";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ImageDropzone } from "../ui/ImageDropzone";
import {
  CreateProjectInput,
  createProjectSchema,
} from "../../schemas/ProjectSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import { Home } from "../../interfaces/models/Home";
import { Portfolio } from "../../interfaces/models/Portfolio";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProjectFormProps {
  onSuccess?: () => void;
  projectId?: string; // For editing existing projects
}

const ProjectForm = forwardRef<
  { submit: () => Promise<boolean> },
  ProjectFormProps
>(({ onSuccess, projectId }, ref) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      portfolioId: "",
      hasDemo: false,
      hasRepo: false,
      isFeatured: false,
      repositoryUrl: "",
      demoUrl: "",
      languages: [],
      techonologies: [],
      homeId: "",
      mainImage: undefined,
      images: [],
      isActive: true,
    },
  });

  // Expose submit method to parent component
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

  const isFeatured = watch("isFeatured", false);
  const hasRepo = watch("hasRepo", false);
  const hasDemo = watch("hasDemo", false);

  // get portfolios/homes from api
  const { data: portfolios } = useQuery({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const res = await api.get<Portfolio[]>("/portfolio");
      return res.data;
    },
  });

  const { data: homes } = useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      const res = await api.get<Home[]>("/home");
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
      formData.append("portfolioId", data.portfolioId);
      formData.append("hasDemo", data.hasDemo.toString());
      formData.append("hasRepo", data.hasRepo.toString());
      formData.append("isFeatured", data.isFeatured.toString());
      formData.append("repositoryUrl", data.repositoryUrl);
      formData.append("demoUrl", data.demoUrl);
      formData.append("languages", data.languages.join(","));
      formData.append("techonologies", data.techonologies.join(","));
      formData.append("homeId", data.homeId as string);
      formData.append("isActive", data.isActive.toString());
      formData.append("mainImage", data.mainImage as File);
      formData.append("images", data.images as File[]);

      const res = await api.post<CreateProjectInput>("/projects", formData, {
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
    },
  });

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      setIsSubmitting(true);

      if (projectId) {
        // Update existing project
        console.log("Updating project", data);
      } else {
        // Create new project
        console.log("Creating project", data);
        createProjectMutation.mutate(data); // Assuming you have a mutation for creating a projec
      }

      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      console.error("Error saving project:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex flex-col space-y-4 p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex space-x-8">
        <div className="w-full flex flex-col space-y-4">
          <Input
            label="Nombre"
            placeholder="Ingrese el nombre del proyecto"
            labelPlacement="outside"
            variant="faded"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...register("name")}
          />
          <Textarea
            label="Descripcion corta"
            placeholder="Ingrese la descripcion corta del proyecto"
            labelPlacement="outside"
            variant="faded"
            isInvalid={!!errors.shortDescription}
            errorMessage={errors.shortDescription?.message}
            minRows={2}
            {...register("shortDescription")}
          />
          <Textarea
            label="Descripcion larga"
            placeholder="Ingrese la descripcion larga del proyecto"
            labelPlacement="outside"
            variant="faded"
            isInvalid={!!errors.longDescription}
            errorMessage={errors.longDescription?.message}
            minRows={5}
            {...register("longDescription")}
          />
        </div>
        <div className="w-full flex flex-col space-y-8">
          <div className="flex ">
            <Controller
              name="portfolioId"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  variant="faded"
                  label="Portafolio"
                  placeholder="Seleccione portafolio"
                  labelPlacement="outside"
                  isLoading={false}
                  isDisabled={false}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0]?.toString() || "";
                    field.onChange(selectedKey);
                  }}
                  isInvalid={!!errors.portfolioId}
                  errorMessage={errors.portfolioId?.message}
                >
                  {portfolios?.map((portfolio) => (
                    <SelectItem key={portfolio?.id} value={portfolio.id}>
                      {portfolio.title}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <div className="flex ">
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Es destacado"
                  orientation="horizontal"
                  className="w-[50%]"
                  isInvalid={!!errors.isFeatured}
                  errorMessage={errors.isFeatured?.message}
                  value={field.value ? "active" : "inactive"}
                  onValueChange={(value) => field.onChange(value === "active")}
                >
                  <Radio value="active">Si</Radio>
                  <Radio value="inactive">No</Radio>
                </RadioGroup>
              )}
            />
            <Controller
              name="homeId"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  isDisabled={!isFeatured}
                  variant="faded"
                  label="Home"
                  placeholder="Seleccione home"
                  labelPlacement="outside"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0]?.toString() || "";
                    field.onChange(selectedKey);
                  }}
                  isInvalid={!!errors.homeId}
                  errorMessage={errors.homeId?.message}
                >
                  {homes?.map((home) => (
                    <SelectItem key={home?.id} value={home.id}>
                      {home.heroTitle}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="flex">
            <Controller
              name="hasRepo"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Tiene codigo"
                  orientation="horizontal"
                  className="w-[50%]"
                  isInvalid={!!errors.hasRepo}
                  errorMessage={errors.hasRepo?.message}
                  value={field.value ? "active" : "inactive"}
                  onValueChange={(value) => field.onChange(value === "active")}
                >
                  <Radio value="active">Si</Radio>
                  <Radio value="inactive">No</Radio>
                </RadioGroup>
              )}
            />
            <Input
              label="Url del repositorio"
              placeholder="Ingrese la url del repositorio"
              labelPlacement="outside"
              variant="faded"
              isInvalid={!!errors.repositoryUrl}
              errorMessage={errors.repositoryUrl?.message}
              isDisabled={!hasRepo}
              {...register("repositoryUrl")}
            />
          </div>
          <div className="flex">
            <Controller
              name="hasDemo"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Tiene demo"
                  orientation="horizontal"
                  className="w-[50%]"
                  isInvalid={!!errors.hasDemo}
                  errorMessage={errors.hasDemo?.message}
                  value={field.value ? "active" : "inactive"}
                  onValueChange={(value) => field.onChange(value === "active")}
                >
                  <Radio value="active">Si</Radio>
                  <Radio value="inactive">No</Radio>
                </RadioGroup>
              )}
            />
            <Input
              label="Url de la demo"
              placeholder="Ingrese la url de la demo"
              labelPlacement="outside"
              variant="faded"
              isInvalid={!!errors.demoUrl}
              errorMessage={errors.demoUrl?.message}
              isDisabled={!hasDemo}
              {...register("demoUrl")}
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-8 w-full">
        <div className="w-full">
          <DynamicTextInput
            name="techonologies"
            label="Tecnologias"
            buttonLabel="Agregar tecnologia"
            inputPlaceholder="Ej: React"
            register={register}
            control={control}
          />
        </div>
        <div className="w-full">
          <DynamicTextInput
            name="languages"
            label="Lenguajes"
            buttonLabel="Agregar lenguaje"
            inputPlaceholder="Ej: JavaScript"
            register={register}
            control={control}
          />
        </div>
      </div>
      <div className="flex space-x-8 w-full mt-4">
        <ImageDropzone
          control={control}
          name="mainImage"
          label="Imagen principal"
        />
        <ImageDropzone
          control={control}
          name="images"
          label="Imagenes galeria"
          multiple
          maxFiles={5}
        />
      </div>
    </form>
  );
});

export default ProjectForm;
