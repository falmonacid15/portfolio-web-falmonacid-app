import { useMutation, useQuery } from "@tanstack/react-query";
import HeaderPage from "../../components/shared/layout/HeaderPage";
import { DataTable } from "../../components/ui/DataTable";
import { FormContact } from "../../interfaces/models/FormContact";
import api from "../../lib/axios";
import { addToast, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import ViewModal from "../../components/ui/modals/ViewModal";
import ContactFormView from "../../components/views/ContactFormView";

const contactFormsColumns = [
  {
    key: "name" as const,
    label: "NOMBRE",
  },
  {
    key: "email" as const,
    label: "EMAIL",
  },
  {
    key: "message" as const,
    label: "MENSAJE",
  },
  {
    key: "createdAt" as const,
    label: "RECIBIDO EL",
  },
  {
    key: "actions" as const,
    label: "ACCIONES",
  },
];

export default function ContactFormPage() {
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<FormContact | null>(
    null
  );

  const viewModalDisclosure = useDisclosure();

  const {
    data: contactForms,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["contactForms", page],
    queryFn: async () => {
      const res = await api.get(`/form-contact?page=${page}`);
      return res.data;
    },
  });

  const sendTestEmailMutation = useMutation({
    mutationKey: ["test-email"],
    mutationFn: async () => {
      const res = await api.post("/mailer/test");
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Correo enviado",
        description:
          "Se ha enviado un correo de prueba a tu correo electrónico.",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Ha ocurrido un error al enviar el correo.",
        color: "danger",
      });
    },
  });

  const handleSendTestEmail = async () => {
    await sendTestEmailMutation.mutateAsync();
    refetch();
  };

  const handleViewContact = (contact: FormContact) => {
    setSelectedContact(contact);
    viewModalDisclosure.onOpenChange();
  };

  useEffect(() => {
    if (!viewModalDisclosure.isOpen) setSelectedContact(null);
  }, [viewModalDisclosure.isOpen]);

  return (
    <div className="flex flex-col space-y-8">
      <HeaderPage
        title="Formularios de contacto"
        description="Lista de los formularios de contacto que ha completado la gente en tu portafolio."
      />
      <ViewModal
        key="contacts-view"
        isOpen={viewModalDisclosure.isOpen}
        onOpenChange={viewModalDisclosure.onOpenChange}
        title={`Contacto de ${selectedContact?.name}`}
      >
        <ContactFormView {...selectedContact!} />
      </ViewModal>
      <div className="p-4">
        <DataTable<Omit<FormContact, "">>
          columns={contactFormsColumns}
          rows={contactForms?.data || []}
          onView={handleViewContact}
          actionButton={handleSendTestEmail}
          actionButtonLabel="Enviar correo de prueba"
          actionButtonIcon="lucide:mail"
          isLoading={isFetching}
          searchable
          page={page}
          onPageChange={(page) => setPage(page)}
          totalCount={contactForms?.meta.totalCount}
        />
      </div>
    </div>
  );
}
