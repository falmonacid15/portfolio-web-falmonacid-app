import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { navItemsSidebar } from "./Sidebar";

const createRouteConfig = () => {
  const config: Record<string, { label: string; icon: string }> = {
    "": { label: "Inicio", icon: "lucide:home" },
    admin: {
      label: "Panel de administración",
      icon: "lucide:layout-dashboard",
    },
  };

  // Process all sidebar navigation items
  navItemsSidebar.forEach((section) => {
    section.items.forEach((item) => {
      // Extract path segments without leading slash
      const path = item.href.split("/").filter(Boolean);

      if (path.length > 0) {
        // For each segment in the path, add to config if not already present
        const lastSegmentIndex = path.length - 1;

        // Add the last segment with the full label and icon from the nav item
        const lastSegment = path[lastSegmentIndex];
        if (!config[lastSegment]) {
          config[lastSegment] = {
            label: item.label,
            icon: item.icon,
          };
        }

        // For nested routes, ensure parent segments are also in the config
        for (let i = 0; i < lastSegmentIndex; i++) {
          const segment = path[i];
          if (!config[segment]) {
            config[segment] = {
              label: segment.charAt(0).toUpperCase() + segment.slice(1),
              icon: "lucide:folder",
            };
          }
        }
      }
    });
  });

  return config;
};

const ROUTE_CONFIG = createRouteConfig();

interface CustomBreadcrumbProps {
  productName?: string;
  itemName?: string;
}

export default function CustomBreadcrumb({ itemName }: CustomBreadcrumbProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const segments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    // Handle special case for item detail pages
    if (index === segments.length - 1 && itemName) {
      const parentSegment = segments[index - 1];
      // Different icons based on parent segment type
      let icon = "lucide:file";

      if (parentSegment === "projects") icon = "lucide:folder";
      else if (parentSegment === "skills") icon = "lucide:code-2";
      else if (parentSegment === "experiences") icon = "lucide:briefcase";

      return {
        href,
        label: itemName,
        icon,
      };
    }

    // Use the config or generate a default
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
      {/* Home link always present */}
      <BreadcrumbItem
        startContent={<Icon icon={ROUTE_CONFIG[""].icon} className="w-5 h-5" />}
      >
        <Link to="/">{ROUTE_CONFIG[""].label}</Link>
      </BreadcrumbItem>

      {/* Admin link always present for admin routes */}
      {segments[0] === "admin" && (
        <BreadcrumbItem
          startContent={
            <Icon icon={ROUTE_CONFIG["admin"].icon} className="w-5 h-5" />
          }
        >
          <Link to="/admin">{ROUTE_CONFIG["admin"].label}</Link>
        </BreadcrumbItem>
      )}

      {/* Dynamic breadcrumb items, skipping admin since we already added it */}
      {breadcrumbItems
        .filter((_, index) => !(segments[0] === "admin" && index === 0))
        .map((item) => (
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
