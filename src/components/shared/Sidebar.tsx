"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Tooltip,
  Divider,
  DrawerFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import AppIcon from "../icons/AppIcon";

interface SidebarProps {
  isExpanded: boolean;
}

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const navItemsSidebar: NavSection[] = [
  {
    section: "Administrador",
    items: [
      {
        icon: "lucide:layout-dashboard",
        label: "Dashboard",
        href: "/admin",
      },
      {
        icon: "lucide:eye",
        label: "Vista previa",
        href: "/admin/preview",
      },
      {
        icon: "lucide:mail",
        label: "Formularios de contacto",
        href: "/admin/contact-forms",
      },
    ],
  },
  {
    section: "Paginas portafolio web",
    items: [
      {
        icon: "lucide:home",
        label: "Pagina inicio",
        href: "/admin/home",
      },
      {
        icon: "lucide:user",
        label: "Pagina sobre mi",
        href: "/admin/aboutme",
      },
      {
        icon: "lucide:briefcase",
        label: "Pagina portafolio proyectos",
        href: "/admin/portfolio",
      },
      {
        icon: "lucide:message-circle",
        label: "Pagina contacto",
        href: "/admin/contact",
      },
    ],
  },
  {
    section: "Mantenedores de contenido",
    items: [
      {
        icon: "lucide:folder",
        label: "Proyectos",
        href: "/admin/projects",
      },
      {
        icon: "lucide:tag",
        label: "Categorias de habilidades",
        href: "/admin/skill-categories",
      },
      {
        icon: "lucide:code-2",
        label: "Habilidades",
        href: "/admin/skills",
      },
      {
        icon: "lucide:briefcase",
        label: "Experiencias laborales",
        href: "/admin/experiences",
      },
    ],
  },
  {
    section: "Ajustes",
    items: [
      {
        icon: "lucide:settings",
        label: "Ajustes de cuenta",
        href: "/settings",
      },
    ],
  },
];

export const Sidebar = ({ isExpanded }: SidebarProps) => {
  return (
    <aside
      className={`hidden sm:flex flex-col border-r-2 border-divider fixed top-[64px] bottom-0 z-10 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-24"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto">
          {navItemsSidebar.map((section, idx) => (
            <SidebarItem
              key={idx}
              section={section}
              idx={idx}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onClose} placement="left">
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2 border-b border-divider">
          <AppIcon />
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-2 py-4">
            {navItemsSidebar.map((section, idx) => (
              <MobileSidebarItem key={idx} section={section} />
            ))}
          </div>
        </DrawerBody>
        <DrawerFooter className="flex justify-center">
          {/* {session ? <ProfileMenu /> : <AuthButtons />} */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface SidebarItemsProps {
  section: NavSection;
  isExpanded?: boolean;
  idx: number;
}

const SidebarItem = ({ section, isExpanded, idx }: SidebarItemsProps) => {
  return (
    <div key={section.section} className="py-2">
      {isExpanded && (
        <div className="px-4 py-2">
          <span className="text-sm font-semibold text-primary-foreground">
            {section.section}
          </span>
        </div>
      )}
      <div className="space-y-1">
        {section.items.map((item) => (
          <Tooltip
            key={item.label}
            content={item.label}
            placement="right"
            delay={50}
            color="secondary"
            isDisabled={isExpanded}
            classNames={{
              content: "text-primary-foreground font-extrabold",
            }}
          >
            <Link
              to={item.href}
              className={`flex items-center gap-3 mx-2 p-2 rounded-lg hover:bg-content2/60 backdrop-blur-xl group transition-all ${
                !isExpanded && "justify-center"
              }`}
            >
              <Icon
                icon={item.icon}
                className="text-xl flex-shrink-0 text-foreground group-hover:text-primary transition-colors w-7 h-7"
              />
              {isExpanded && (
                <div className="flex items-center justify-between flex-1">
                  <span className="line-clamp-1 text-foreground/60 group-hover:text-foreground/90">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="bg-primary text-tiny text-white px-2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          </Tooltip>
        ))}
      </div>

      {idx < navItemsSidebar.length - 1 && isExpanded && (
        <Divider className="my-2" />
      )}
    </div>
  );
};

interface MobileSidebarItemProps {
  section: NavSection;
}

const MobileSidebarItem = ({ section }: MobileSidebarItemProps) => {
  return (
    <div key={section.section}>
      <div className="px-2 py-2">
        <span className="text-sm font-semibold text-default-500">
          {section.section}
        </span>
      </div>
      {section.items.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100"
        >
          <Icon icon={item.icon} className="text-xl" />
          <div className="flex items-center justify-between flex-1">
            <span>{item.label}</span>
            {item.badge && (
              <span className="bg-primary text-tiny text-white px-2 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        </Link>
      ))}
      <Divider className="my-2" />
    </div>
  );
};
