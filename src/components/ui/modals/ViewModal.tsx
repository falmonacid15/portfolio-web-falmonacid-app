import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface ViewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export default function ViewModal({
  isOpen,
  onOpenChange,
  title,
  children,
}: ViewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex justify-center">
          <h1 className="font-bold text-lg">{title}</h1>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter className="flex justify-center"></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
