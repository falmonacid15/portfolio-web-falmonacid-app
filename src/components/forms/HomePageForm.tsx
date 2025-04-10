import { useEffect, useState } from "react";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { DynamicTextInput } from "../../components/ui/DynamicTextInput";
import {
  CreateHomePageInput,
  createhomePageSchema,
} from "../../schemas/HomePageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

export default function HomePageForm() {
  const [editing, setEditing] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateHomePageInput>({
    resolver: zodResolver(createhomePageSchema),
    defaultValues: {
      heroTitle: "",
      heroSubtitle: "",
      workExperienceTitle: "",
      workExperienceSubtitle: "",
      portfolioTitle: "",
      portfolioSubtitle: "",
      descriptions: [],
    },
    mode: "onSubmit",
  });

  const { data: homePagedata } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const res = await api.get("/home/first");
      return res.data;
    },
  });

  const updateHomePageMutation = useMutation({
    mutationKey: ["homepage-update"],
    mutationFn: async (data: CreateHomePageInput) => {
      const res = await api.post("/home/upsert", data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Contenido actualizado",
        description:
          "El contenido de la pagina inicio de tu portafolio ha sido actualizado.",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al actualizar",
        description: "Ha ocurrido un error al actualizar el contenido.",
        color: "danger",
      });
    },
  });

  const onSubmit = (data: CreateHomePageInput) => {
    if (editing) {
      updateHomePageMutation.mutate(data);
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditing(true);
  };

  useEffect(() => {
    if (homePagedata) {
      setValue("heroTitle", homePagedata.heroTitle);
      setValue("heroSubtitle", homePagedata.heroSubtitle);
      setValue("workExperienceTitle", homePagedata.workExperienceTitle);
      setValue("workExperienceSubtitle", homePagedata.workExperienceSubtitle);
      setValue("portfolioTitle", homePagedata.portfolioTitle);
      setValue("portfolioSubtitle", homePagedata.portfolioSubtitle);
      setValue("descriptions", homePagedata.descriptions);
    }
  }, [homePagedata, setValue]);

  return (
    <form
      className="flex flex-col mt-8 px-4 sm:px-16 space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-start sm:justify-end items-center space-x-2">
        {editing && (
          <Button
            color="danger"
            variant="ghost"
            startContent={<Icon icon="lucide:x" className="w-5 h-5" />}
            onClick={(e) => {
              e.preventDefault();
              setEditing(false);
            }}
            type="button"
          >
            Cancelar edicion
          </Button>
        )}
        {editing ? (
          <Button
            color="success"
            variant="ghost"
            startContent={<Icon icon="lucide:save" className="w-5 h-5" />}
            type="submit"
          >
            Guardar contenido
          </Button>
        ) : (
          <Button
            color="primary"
            variant="ghost"
            startContent={<Icon icon="lucide:edit" className="w-5 h-5" />}
            type="button"
            onClick={handleEditClick}
          >
            Editar contenido
          </Button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-8">
        <div className="flex flex-col space-y-2 w-full">
          <h1 className="text-lg p-2 text-foreground/60 transition-colors mb-8">
            Hero section
          </h1>
          <Input
            isRequired
            size="lg"
            labelPlacement="outside"
            label="Titulo"
            placeholder="Titulo del hero"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.heroTitle}
            errorMessage={errors.heroTitle?.message}
            value={watch("heroTitle")}
            {...register("heroTitle")}
          />
          <Textarea
            isRequired
            size="lg"
            labelPlacement="outside"
            label="Subtitulo"
            placeholder="Subtitulo del hero"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.heroSubtitle}
            errorMessage={errors.heroSubtitle?.message}
            minRows={6}
            value={watch("heroSubtitle")}
            {...register("heroSubtitle")}
          />
        </div>
        <div className="flex flex-col space-y-2 w-full">
          <h1 className="text-lg p-2 text-foreground/60 transition-colors mb-8">
            Work Experiences timeline
          </h1>
          <Input
            isRequired
            size="lg"
            labelPlacement="outside"
            label="Titulo"
            placeholder="Titulo de experiencia laboral"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.workExperienceTitle}
            errorMessage={errors.workExperienceTitle?.message}
            value={watch("workExperienceTitle")}
            {...register("workExperienceTitle")}
          />
          <Textarea
            isRequired
            size="lg"
            labelPlacement="outside"
            label="Subtitulo"
            placeholder="Subtitulo de experiencia laboral"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.workExperienceSubtitle}
            errorMessage={errors.workExperienceSubtitle?.message}
            minRows={6}
            value={watch("workExperienceSubtitle")}
            {...register("workExperienceSubtitle")}
          />
        </div>
        <div className="flex flex-col space-y-2 w-full">
          <h1 className="text-lg p-2 text-foreground/60 transition-colors mb-8">
            Portfolio section
          </h1>
          <Input
            isRequired
            size="lg"
            labelPlacement="outside"
            label="Titulo"
            placeholder="Titulo de portafolio de proyectos"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.portfolioTitle}
            errorMessage={errors.portfolioTitle?.message}
            value={watch("portfolioTitle")}
            {...register("portfolioTitle")}
          />
          <Textarea
            isRequired
            size="lg"
            labelPlacement="outside"
            label="Subtitulo"
            placeholder="Subtitulo de porafolio de proyectos"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.portfolioSubtitle}
            errorMessage={errors.portfolioSubtitle?.message}
            minRows={6}
            value={watch("portfolioSubtitle")}
            {...register("portfolioSubtitle")}
          />
        </div>
      </div>
      <div>
        <DynamicTextInput
          name="descriptions"
          label="Descripciones"
          control={control}
          register={register}
          disabled={!editing}
        />
      </div>
    </form>
  );
}
