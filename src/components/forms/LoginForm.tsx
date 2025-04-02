import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { loginSchema } from "../../schemas/LoginSchema";
import { useAuthStore } from "../../store/authStore";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { login } = useAuthStore();
  const router = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["admin-login"],
    mutationFn: async (data: LoginFormValues) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data);
      addToast({
        title: `Hola denuevo, ${data.user.name}`,
        description: "Bienvenido a tu panel de administracion.",
        color: "success",
        classNames: {
          title: "font-extrabold",
        },
      });
      router("/admin");
    },
    onError: () => {
      addToast({
        title: "Inicio de sesion fallido",
        description: "Credenciales incorrectas",
        color: "danger",
        classNames: {
          title: "font-extrabold",
        },
      });
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoComplete="off"
        isRequired
        label="Correo electronico"
        labelPlacement="outside"
        placeholder="Ingresa tu correo electronico"
        variant="underlined"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
        isDisabled={loginMutation.isPending}
      />
      <Input
        isRequired
        autoComplete="off"
        endContent={
          <button type="button" onClick={toggleVisibility}>
            {isVisible ? (
              <Icon
                className="pointer-events-none text-2xl text-default-400"
                icon="solar:eye-closed-linear"
              />
            ) : (
              <Icon
                className="pointer-events-none text-2xl text-default-400"
                icon="solar:eye-bold"
              />
            )}
          </button>
        }
        label="Contraseña"
        labelPlacement="outside"
        placeholder="Ingresa tu contraseña"
        type={isVisible ? "text" : "password"}
        variant="underlined"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        {...register("password")}
        isDisabled={loginMutation.isPending}
      />

      <Button
        className="w-full mt-4"
        color="primary"
        type="submit"
        isLoading={loginMutation.isPending}
      >
        Iniciar sesion
      </Button>
    </form>
  );
}
