import { addToast, Button, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreatePortfolioPageInput,
  createPortfolioPageSchema,
} from "../../schemas/PortfolioPageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

export default function PortfolioPageForm() {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePortfolioPageInput>({
    resolver: zodResolver(createPortfolioPageSchema),
  });

  const { data: portfolioData } = useQuery({
    queryKey: ["portfolioPage"],
    queryFn: async () => {
      const res = await api.get("/portfolio/first");

      return res.data;
    },
  });

  const upsertPortfolioPageMutation = useMutation({
    mutationKey: ["upsertPortfolioPage"],
    mutationFn: async (data: CreatePortfolioPageInput) => {
      const res = await api.patch(`/portfolio/${portfolioData.id}`, data);

      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Contenido actualizado",
        description:
          "El contenido de la pagina de portafolio ha sido actualizado",
        color: "success",
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditing(true);
  };

  const onSubmit = (data: CreatePortfolioPageInput) => {
    if (editing) {
      upsertPortfolioPageMutation.mutate(data);
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  useEffect(() => {
    if (portfolioData) {
      setValue("title", portfolioData.title);
      setValue("description", portfolioData.description);
    }
  }, [portfolioData]);
  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-end mb-4 space-x-4">
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
      <Input
        labelPlacement="outside"
        size="lg"
        label="Titulo seccion proyectos"
        placeholder="Ingrese el titulo para la sección proyectos"
        variant="faded"
        isDisabled={!editing}
        isInvalid={!!errors.title}
        errorMessage={errors.title?.message}
        {...register("title")}
      />
      <Textarea
        labelPlacement="outside"
        size="lg"
        label="Subtitulo sección proyectos"
        placeholder="Ingrese el subtitulo para la sección proyectos"
        variant="faded"
        isDisabled={!editing}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        {...register("description")}
      />
    </form>
  );
}
