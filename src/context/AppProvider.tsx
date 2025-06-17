import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "../lib/react-query";
import { AuthProvider } from "./AuthProvider";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider />
          {children}
        </QueryClientProvider>
      </HeroUIProvider>
    </AuthProvider>
  );
}
