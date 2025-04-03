import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { UseFormRegister, useFieldArray, Control } from "react-hook-form";

interface DynamicTextInputProps {
  name: string;
  control: Control<any>;
  register: UseFormRegister<any>;
  label?: string;
  disabled?: boolean;
}

export const DynamicTextInput: React.FC<DynamicTextInputProps> = ({
  name,
  control,
  register,
  label = "Textos",
  disabled = false,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <label
        className={`block text-sm font-medium ${
          disabled ? "text-foreground/40" : "text-foreground"
        }`}
      >
        {label}
      </label>
      <Button
        color="primary"
        variant="ghost"
        startContent={<Icon icon="lucide:plus" width={20} />}
        onPress={() => append("")}
        isDisabled={disabled}
      >
        Agregar texto
      </Button>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            {...register(`${name}.${index}`)}
            placeholder="Ingrese texto"
            variant="faded"
            isDisabled={disabled}
          />

          <Button
            isIconOnly
            variant="ghost"
            color="danger"
            onPress={() => remove(index)}
            isDisabled={disabled}
          >
            <Icon icon="lucide:trash-2" width={20} />
          </Button>
        </div>
      ))}
    </div>
  );
};
