import { Button, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function PortfolioPageForm() {
  const [editing, setEditing] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditing(true);
  };
  return (
    <form className="flex flex-col space-y-4">
      <div className="flex justify-end mb-4">
        {editing && (
          <Button
            color="danger"
            variant="ghost"
            startContent={<Icon icon="lucide:x" className="w-5 h-5" />}
            onClick={(e) => {
              e.preventDefault();
              setEditing(false);
            }}
            type="button"
          >
            Cancelar edicion
          </Button>
        )}
        {editing ? (
          <Button
            color="success"
            variant="ghost"
            startContent={<Icon icon="lucide:save" className="w-5 h-5" />}
            type="submit"
          >
            Guardar contenido
          </Button>
        ) : (
          <Button
            color="primary"
            variant="ghost"
            startContent={<Icon icon="lucide:edit" className="w-5 h-5" />}
            type="button"
            onClick={handleEditClick}
          >
            Editar contenido
          </Button>
        )}
      </div>
      <Input
        labelPlacement="outside"
        size="lg"
        label="Titulo seccion proyectos"
        placeholder="Ingrese el titulo para la sección proyectos"
        variant="faded"
        isDisabled={!editing}
      />
      <Textarea
        labelPlacement="outside"
        size="lg"
        label="Subtitulo sección proyectos"
        placeholder="Ingrese el subtitulo para la sección proyectos"
        variant="faded"
        isDisabled={!editing}
      />
    </form>
  );
}
