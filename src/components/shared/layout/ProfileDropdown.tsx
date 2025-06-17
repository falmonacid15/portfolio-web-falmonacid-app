import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useAuthStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const { logout, session } = useAuthStore();
  const router = useNavigate();
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar isBordered as="button" className="transition-transform" />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        topContent={
          <div className="p-2 flex flex-col items-center">
            <h1 className="text-lg font-medium">Bienvenido denuevo,</h1>
            <span className="text-secondary font-black text-base">
              {session?.user?.name}
            </span>
          </div>
        }
      >
        <DropdownItem
          key="settings"
          onPress={() => {
            router("/admin/settings");
          }}
        >
          Ajustes de cuenta
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onPress={() => {
            logout();
          }}
        >
          Cerrar sesion
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
