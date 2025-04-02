"use client";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { navItemsSidebar } from "./Sidebar";

const createRouteConfig = () => {
  const config: Record<string, { label: string; icon: string }> = {
    "": { label: "Inicio", icon: "lucide:home" },
  };
  navItemsSidebar.forEach((section) => {
    section.items.forEach((item) => {
      const path = item.href.split("/").filter(Boolean);
      if (path.length > 0) {
        path.forEach((segment, index) => {
          if (!config[segment]) {
            config[segment] = {
              label:
                index === path.length - 1
                  ? item.label
                  : segment.charAt(0).toUpperCase() + segment.slice(1),
              icon: index === path.length - 1 ? item.icon : "lucide:circle",
            };
          }
        });
      }
    });
  });

  return config;
};

const ROUTE_CONFIG = createRouteConfig();

interface CustomBreadcrumbProps {
  productName?: string;
}

export default function CustomBreadcrumb({
  productName,
}: CustomBreadcrumbProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const segments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    if (
      index === segments.length - 1 &&
      productName &&
      segments[index - 1] === "projects"
    ) {
      return {
        href,
        label: productName,
        icon: "lucide:folder",
      };
    }

    const config = ROUTE_CONFIG[segment] || {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      icon: "lucide:circle",
    };

    return {
      href,
      label: config.label,
      icon: config.icon,
    };
  });

  return (
    <Breadcrumbs variant="bordered" size="lg">
      <BreadcrumbItem
        startContent={<Icon icon={ROUTE_CONFIG[""].icon} className="w-5 h-5" />}
      >
        <Link to="/">{ROUTE_CONFIG[""].label}</Link>
      </BreadcrumbItem>

      {breadcrumbItems.map((item) => (
        <BreadcrumbItem
          key={`breadcrumb-${item.href}`}
          startContent={<Icon icon={item.icon} className="w-5 h-5" />}
        >
          <Link to={item.href}>{item.label}</Link>
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
