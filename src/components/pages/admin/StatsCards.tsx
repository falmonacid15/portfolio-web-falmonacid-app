import { Button, Card, cn } from "@heroui/react";
import { Icon } from "@iconify/react";

const data = [
  {
    title: "Total Mensajes",
    value: "300",
    changeType: "positive",
    iconName: "lucide:message-circle",
  },
  {
    title: "Total Habilidades",
    value: "25",
    changeType: "neutral",
    iconName: "lucide:code-2",
  },
  {
    title: "Total Proyectos",
    value: "4",
    changeType: "negative",
    iconName: "lucide:folder",
  },
];
export default function StatsCards() {
  return (
    <dl className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 px-8 mt-8">
      {data.map(({ title, value, changeType, iconName }, index) => (
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
                {value}
              </dd>
            </div>
          </div>

          <div className="bg-default-100">
            <Button
              fullWidth
              className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
              radius="none"
              variant="light"
            >
              Ver más
            </Button>
          </div>
        </Card>
      ))}
    </dl>
  );
}
