import { addToast, Button, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateContactPageInput,
  createContactPageSchema,
} from "../../schemas/ContactPageSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

export default function ContactPageForm() {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateContactPageInput>({
    resolver: zodResolver(createContactPageSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      email: "",
      emailLabel: "",
      linkedIn: "",
      linkedInLabel: "",
      github: "",
      githubLabel: "",
    },
    mode: "onSubmit",
  });

  const { data: contactPageData } = useQuery({
    queryKey: ["contactPage"],
    queryFn: async () => {
      const res = await api.get("/contact/first");
      return res.data;
    },
  });

  const updateContactPageMutation = useMutation({
    mutationKey: ["updateContactPage"],
    mutationFn: async (data: CreateContactPageInput) => {
      const res = await api.patch(`/contact/${contactPageData.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Contenido actualizado",
        description:
          "El contenido de la pagina de contacto de tu portafolio ha sido actualizado",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al actualizar",
        description:
          "Ha ocurrido un error al actualizar el contenido de la pagina de contacto de tu portafolio",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data: CreateContactPageInput) => {
    if (editing) {
      await updateContactPageMutation.mutateAsync(data);
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
    if (contactPageData) {
      setValue("title", contactPageData.title);
      setValue("subtitle", contactPageData.subtitle);
      setValue("email", contactPageData.email);
      setValue("emailLabel", contactPageData.emailLabel);
      setValue("linkedIn", contactPageData.linkedIn);
      setValue("linkedInLabel", contactPageData.linkedInLabel);
      setValue("github", contactPageData.github);
      setValue("githubLabel", contactPageData.githubLabel);
    }
  }, [contactPageData, setValue]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-end mb-4 gap-2">
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
            Cancelar edición
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
      <Input
        labelPlacement="outside"
        size="lg"
        label="Titulo sección contacto"
        placeholder="Ingrese el titulo para la sección contacto"
        variant="faded"
        isDisabled={!editing}
        isInvalid={!!errors.title}
        errorMessage={errors.title?.message}
        value={watch("title")}
        {...register("title")}
      />
      <Textarea
        labelPlacement="outside"
        size="lg"
        label="Subtitulo sección contacto"
        placeholder="Ingrese el subtitulo para la sección contacto"
        variant="faded"
        isDisabled={!editing}
        isInvalid={!!errors.subtitle}
        errorMessage={errors.subtitle?.message}
        value={watch("subtitle")}
        {...register("subtitle")}
      />
      <div className="flex w-full gap-4">
        <div className="flex flex-col gap-4 w-full">
          <Input
            labelPlacement="outside"
            size="lg"
            label="Email"
            placeholder="Ingresa el email"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            value={watch("email")}
            {...register("email")}
          />
          <Input
            labelPlacement="outside"
            size="lg"
            label="Etiqueta del email"
            placeholder="Ingrese el texto para el email"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.emailLabel}
            errorMessage={errors.emailLabel?.message}
            value={watch("emailLabel")}
            {...register("emailLabel")}
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Input
            labelPlacement="outside"
            size="lg"
            label="LinkedIn"
            placeholder="Ingresa el link de LinkedIn"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.linkedIn}
            errorMessage={errors.linkedIn?.message}
            value={watch("linkedIn")}
            {...register("linkedIn")}
          />
          <Input
            labelPlacement="outside"
            size="lg"
            label="Etiqueta de linkedIn"
            placeholder="Ingrese el texto para linkedIn"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.linkedInLabel}
            errorMessage={errors.linkedInLabel?.message}
            value={watch("linkedInLabel")}
            {...register("linkedInLabel")}
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Input
            labelPlacement="outside"
            size="lg"
            label="Github"
            placeholder="Ingresa el link de GitHub"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.github}
            errorMessage={errors.github?.message}
            value={watch("github")}
            {...register("github")}
          />
          <Input
            labelPlacement="outside"
            size="lg"
            label="Etiqueta de GitHub"
            placeholder="Ingrese el texto para GitHub"
            variant="faded"
            isDisabled={!editing}
            isInvalid={!!errors.githubLabel}
            errorMessage={errors.githubLabel?.message}
            value={watch("githubLabel")}
            {...register("githubLabel")}
          />
        </div>
      </div>
    </form>
  );
}
