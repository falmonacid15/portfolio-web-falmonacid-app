import {
  NavbarContent,
  Navbar as HeroUiNavBar,
  NavbarItem,
  NavbarBrand,
  Button,
} from "@heroui/react";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Link } from "react-router-dom";
import AppIcon from "../../icons/AppIcon";
import { Icon } from "@iconify/react";
import ProfileDropdown from "./ProfileDropdown";

interface NavbarProps {
  onMenuClick?: () => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const Navbar = ({ isExpanded, setIsExpanded, onMenuClick }: NavbarProps) => {
  return (
    <HeroUiNavBar
      isBordered
      className="border-b-2 border-divider bg-content1/80"
      maxWidth="full"
    >
      <NavbarContent justify="start">
        <Button
          isIconOnly
          variant="light"
          onPress={onMenuClick}
          className="sm:hidden"
        >
          <Icon icon="lucide:menu" className="text-xl" />
        </Button>
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsExpanded(!isExpanded)}
          className="sm:flex hidden"
        >
          <Icon
            icon={!isExpanded ? "lucide:sidebar-open" : "lucide:sidebar-close"}
            className="text-xl w-7 h-7"
          />
        </Button>
        <NavbarBrand className="sm:flex hidden">
          <Link to="/admin">
            <AppIcon />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem className="mr-2">
          <ProfileDropdown />
        </NavbarItem>
      </NavbarContent>
    </HeroUiNavBar>
  );
};

export default Navbar;
