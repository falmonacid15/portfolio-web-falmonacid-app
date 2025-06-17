import { Input, Textarea } from "@heroui/react";
import { FormContact } from "../../interfaces/models/FormContact";

export default function ContactFormView({ name, email, message }: FormContact) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="Nombre" value={name} readOnly />
      <Input label="Email" value={email} readOnly />
      <Textarea label="Mensaje" value={message} readOnly />
    </div>
  );
}
