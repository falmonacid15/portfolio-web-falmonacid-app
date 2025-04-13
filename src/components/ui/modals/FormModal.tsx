import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { cloneElement, useRef, useState } from "react";

interface FormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export default function FormModal({
  title,
  isOpen,
  onOpenChange,
  children,
}: FormModalProps) {
  const formRef = useRef<{ submit: () => Promise<boolean> }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (formRef.current) {
      setIsSubmitting(true);
      try {
        await formRef.current.submit();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {cloneElement(children as React.ReactElement, { ref: formRef })}
        </ModalBody>
        <ModalFooter className="flex justify-center">
          <Button color="danger" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button
            isLoading={isSubmitting}
            color="primary"
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
