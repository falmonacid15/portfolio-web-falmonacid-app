import { Button, Card, cn, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios";
import { useNavigate } from "react-router-dom";

export default function StatsCards() {
  const router = useNavigate();

  const { data: formContacts, isPending: formContactsLoading } = useQuery({
    queryKey: ["formContacts"],
    queryFn: async () => {
      const res = await api.get("/form-contact");
      return res.data;
    },
  });

  const { data: skills, isPending: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await api.get("/skill");
      return res.data;
    },
  });

  const { data: projects, isPending: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data;
    },
  });

  const statsData = [
    {
      title: "Total Mensajes",
      value: formContacts?.meta?.totalCount || "0",
      changeType: "positive",
      iconName: "lucide:message-circle",
      loading: formContactsLoading,
      route: "/admin/contact-forms",
    },
    {
      title: "Total Habilidades",
      value: skills?.meta?.totalCount || "0",
      changeType: "neutral",
      iconName: "lucide:code-2",
      loading: skillsLoading,
      route: "/admin/skills",
    },
    {
      title: "Total Proyectos",
      value: projects?.meta?.totalCount || "0",
      changeType: "negative",
      iconName: "lucide:folder",
      loading: projectsLoading,
      route: "/admin/projects",
    },
  ];

  return (
    <dl className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 px-8 mt-8">
      {statsData.map(
        ({ title, value, changeType, iconName, loading, route }, index) => (
          <Card
            key={index}
            className="border border-transparent dark:border-default-100"
          >
            <div className="flex p-4">
              <div
                className={cn(
                  "mt-1 flex h-8 w-8 items-center justify-center rounded-md",
                  {
                    "bg-success-50": changeType === "positive",
                    "bg-warning-50": changeType === "neutral",
                    "bg-danger-50": changeType === "negative",
                  }
                )}
              >
                {changeType === "positive" ? (
                  <Icon className="text-success" icon={iconName} width={20} />
                ) : changeType === "neutral" ? (
                  <Icon className="text-warning" icon={iconName} width={20} />
                ) : (
                  <Icon className="text-danger" icon={iconName} width={20} />
                )}
              </div>

              <div className="flex flex-col gap-y-2">
                <dt className="mx-4 text-small font-medium text-default-500">
                  {title}
                </dt>
                <dd className="px-4 text-2xl font-semibold text-default-700">
                  {loading ? (
                    <Spinner variant="gradient" color="primary" />
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>

            <div className="bg-default-100">
              <Button
                fullWidth
                className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
                radius="none"
                variant="light"
                onPress={() => {
                  router(route);
                }}
              >
                Ver más
              </Button>
            </div>
          </Card>
        )
      )}
    </dl>
  );
}
