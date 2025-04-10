import { addToast, Button, Input, Textarea } from "@heroui/react";
import { DynamicTextInput } from "../ui/DynamicTextInput";
import { useForm } from "react-hook-form";
import { ImageDropzone } from "../ui/ImageDropzone";
import {
  CreateAboutMePageInput,
  createAboutMePageSchema,
} from "../../schemas/AboutmePageSchema";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import api from "../../lib/axios";

export default function AboutmePageForm() {
  const [editing, setEditing] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAboutMePageInput>({
    resolver: zodResolver(createAboutMePageSchema),
    defaultValues: {
      title: "",
      descriptions: [],
      skillsTitle: "",
      skillsSubtitle: "",
    },
    mode: "onSubmit",
  });

  const { data: AboutMePageData } = useQuery({
    queryKey: ["AboutMePage"],
    queryFn: async () => {
      const { data } = await api.get("/aboutme/first");
      return data.data;
    },
  });

  const updateAboutMePageMutation = useMutation({
    mutationKey: ["updateAboutMePage"],
    mutationFn: async (data: CreateAboutMePageInput) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("skillsTitle", data.skillsTitle);
      formData.append("skillsSubtitle", data.skillsSubtitle);
      data.descriptions.forEach((description, index) => {
        formData.append(`descriptions[${index}]`, description);
      });
      formData.append("image", data.image);

      const { data: response } = await api.post("/aboutme/upsert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    },
    onSuccess: () => {
      addToast({
        title: "Actualizado",
        description: "Se ha actualizado la pagina con exito",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar la pagina",
        color: "danger",
      });
    },
  });

  const onSubmit = (data: CreateAboutMePageInput) => {
    if (editing) {
      updateAboutMePageMutation.mutate(data);
      console.log(data);
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
    if (AboutMePageData) {
      setValue("title", AboutMePageData.title);
      setValue("descriptions", AboutMePageData.descriptions);
      setValue("skillsTitle", AboutMePageData.skillsTitle);
      setValue("skillsSubtitle", AboutMePageData.skillsSubtitle);
    }
  }, [AboutMePageData, setValue]);

  return (
    <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-end space-x-4">
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
      <div className="flex flex-col">
        <h1 className="text-xl font-bold mb-8">Resumen personal</h1>
        <div className="flex items-start space-x-8 w-full">
          <div className="flex flex-col w-full space-y-4">
            <Input
              labelPlacement="outside"
              size="lg"
              label="Titulo"
              placeholder="Ingrese el titulo"
              variant="faded"
              isDisabled={!editing}
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
              value={watch("title")}
              {...register("title")}
            />
            <DynamicTextInput
              name="descriptions"
              label="Descripciones (Párrafos)"
              typeInput="textarea"
              disabled={!editing}
              control={control}
              register={register}
            />
          </div>
          <div className="flex flex-col justify-start w-full">
            <label className="mb-1">Foto de perfil</label>
            <ImageDropzone
              name="image"
              label="Foto perfil"
              disabled={!editing}
              control={control}
              existingImages={AboutMePageData?.image}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold mb-8 mt-8">Sección Habilidades</h1>
          <div className="flex flex-col space-y-4">
            <Input
              labelPlacement="outside"
              size="lg"
              label="Titulo sección habilidades"
              placeholder="Ingrese el titulo para la sección habilidades"
              variant="faded"
              isDisabled={!editing}
              isInvalid={!!errors.skillsTitle}
              errorMessage={errors.skillsTitle?.message}
              value={watch("skillsTitle")}
              {...register("skillsTitle")}
            />
            <Textarea
              labelPlacement="outside"
              size="lg"
              label="Subtitulo sección habilidades"
              placeholder="Ingrese el subtitulo para la sección habilidades"
              variant="faded"
              isDisabled={!editing}
              isInvalid={!!errors.skillsSubtitle}
              errorMessage={errors.skillsSubtitle?.message}
              value={watch("skillsSubtitle")}
              {...register("skillsSubtitle")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
