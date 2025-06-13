import { Button, Input, addToast } from "@heroui/react";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuthStore } from "../../store/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useForm } from "react-hook-form";
import {
  AccountSettingInput,
  accountSettingSchema,
} from "../../schemas/SettingsPageSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SettingPageForm() {
  const [editing, setEditing] = useState(false);
  const { session, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AccountSettingInput>({
    resolver: zodResolver(accountSettingSchema),
    mode: "onChange",
  });

  const { data: userLogged, isLoading: isLoadingUserLogged } = useQuery({
    queryKey: ["user-logged", session?.user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${session?.user?.id}`);
      return res.data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (userLogged) {
      setValue("name", userLogged.name);
      setValue("email", userLogged.email);
    }
  }, [userLogged, setValue]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: AccountSettingInput) => {
      const res = await api.patch(`/users/${session?.user?.id}`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-logged"] });
      setEditing(false);
      addToast({
        title: "Actualización exitosa",
        description: "Tus credenciales han sido actualizadas",
        color: "success",
      });
      addToast({
        title: "Cerrando sesión",
        description:
          "Se cerrará tu sesión para que puedas iniciar sesión con tus nuevas credenciales",
        color: "warning",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      setTimeout(() => {
        logout();
      }, 3000);
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: "No se pudieron actualizar tus credenciales",
        color: "danger",
      });
      console.error(error);
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditing(true);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditing(false);

    if (userLogged) {
      reset({
        name: userLogged.name,
        email: userLogged.email,
      });
    }
  };

  const onSubmit = (data: AccountSettingInput) => {
    updateUserMutation.mutate(data);
  };

  const password = watch("password");

  return (
    <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-end space-x-4">
        {editing && (
          <Button
            color="danger"
            variant="ghost"
            startContent={<Icon icon="lucide:x" className="w-5 h-5" />}
            onClick={handleCancelClick}
            type="button"
            isDisabled={updateUserMutation.isPending}
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
            isLoading={updateUserMutation.isPending}
          >
            Actualizar credenciales
          </Button>
        ) : (
          <Button
            color="primary"
            variant="ghost"
            startContent={<Icon icon="lucide:edit" className="w-5 h-5" />}
            type="button"
            isDisabled={isLoadingUserLogged}
            onClick={handleEditClick}
          >
            Editar credenciales
          </Button>
        )}
      </div>
      <h2 className="text-center text-foreground/60 text-sm">
        Actualizar tus credenciales, hara que tengas que volver a iniciar
        sesión.
      </h2>
      <div className="flex flex-col gap-8 px-24 mt-8">
        <Input
          labelPlacement="outside"
          size="lg"
          label="Nombre de usuario"
          placeholder="Ingrese tu nombre de usuario"
          variant="faded"
          value={watch("name")}
          isDisabled={!editing || updateUserMutation.isPending}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <Input
          labelPlacement="outside"
          size="lg"
          label="Correo electrónico"
          placeholder="Ingrese tu correo electrónico"
          variant="faded"
          value={watch("email")}
          isDisabled={!editing || updateUserMutation.isPending}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register("email")}
        />

        <div className="flex space-x-8">
          <Input
            labelPlacement="outside"
            size="lg"
            label="Nueva Contraseña (opcional)"
            placeholder="Ingresa tu nueva contraseña"
            variant="faded"
            isDisabled={!editing || updateUserMutation.isPending}
            type="password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <Input
            labelPlacement="outside"
            size="lg"
            label="Confirmar nueva contraseña"
            placeholder="Confirma tu nueva contraseña"
            variant="faded"
            isDisabled={!editing || !password || updateUserMutation.isPending}
            type="password"
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              deps: ["password"],
              disabled: !password,
            })}
          />
        </div>
      </div>
    </form>
  );
}
