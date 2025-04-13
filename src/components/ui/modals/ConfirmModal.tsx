import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  isLoading: boolean;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onOpenChange,
  isOpen,
  isLoading,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        <ModalHeader className="flex justify-center text-center">
          {title}
        </ModalHeader>
        <ModalBody>
          <p className="text-center text-foreground/60">{message}</p>
        </ModalBody>
        <ModalFooter className="flex justify-center">
          <Button
            onPress={() => {
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>
          <Button onPress={onConfirm} color="danger" isLoading={isLoading}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
