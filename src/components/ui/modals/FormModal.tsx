import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { ReactNode } from "react";
import useFormStore from "../../../store/formStore";

interface FormModalProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | undefined;
}

export default function FormModal({
  title,
  children,
  isOpen,
  onOpenChange,
  formRef,
  size = "md",
}: FormModalProps) {
  const { formSubmitted } = useFormStore();

  const handleSave = () => {
    if (formRef?.current) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      formRef.current.dispatchEvent(submitEvent);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!formSubmitted) {
          onOpenChange(open);
        }
      }}
      size={size}
      scrollBehavior="inside"
      isDismissable={!formSubmitted}
    >
      <ModalContent>
        <ModalHeader className="justify-center">
          <h1 className="text-lg font-bold">{title}</h1>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onPress={handleClose}
            isDisabled={formSubmitted}
          >
            Cerrar
          </Button>
          <Button
            color="primary"
            isLoading={formSubmitted}
            onPress={handleSave}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
