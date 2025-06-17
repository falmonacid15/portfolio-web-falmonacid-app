import { useTheme } from "@heroui/use-theme";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex h-12 w-12 items-center justify-center rounded-full group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Icon
          icon="tabler:moon-stars"
          className="text-gray-500 group-hover:text-gray-400 transition-colors duration-300"
          width="28"
          height="28"
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.5 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Icon
          icon="tabler:sun"
          className="text-yellow-300 group-hover:text-yellow-400 transition-colors duration-300"
          width="28"
          height="28"
        />
      </motion.div>
    </motion.button>
  );
};
