import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Button, Image, CardFooter, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Control, useController } from "react-hook-form";

export interface ImageDropzoneProps {
  name: string;
  control: Control<any>;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  accept?: string[];
  label?: string;
  existingImages?: string | string[];
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  name,
  control,
  multiple = false,
  maxFiles = 5,
  maxSize = 5242880,
  accept = ["image/jpeg", "image/png", "image/webp"],
  label = "Drop images here or click to select",
  existingImages,
  onFilesSelected,
  disabled = false,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: multiple ? [] : null,
  });

  const createPreviews = (files: File[]) => {
    return files.map((file) => URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  useEffect(() => {
    if (existingImages) {
      if (multiple && Array.isArray(existingImages)) {
        setPreviews(existingImages);
      } else if (!multiple && typeof existingImages === 'string') {
        setPreviews([existingImages]);
      }
    }
  }, [existingImages, multiple]);

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsProcessing(true);

      try {
        const newPreviews = createPreviews(acceptedFiles);

        if (multiple) {
          const newFiles = [...(value || []), ...acceptedFiles];
          onChange(newFiles);
          setPreviews((prev) => [...prev, ...newPreviews]);
        } else {
          onChange(acceptedFiles[0]);
          setPreviews([newPreviews[0]]);
        }

        if (onFilesSelected) {
          onFilesSelected(multiple ? acceptedFiles : [acceptedFiles[0]]);
        }
      } catch (error) {
        console.error("Error processing files:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [multiple, onChange, value, onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    multiple,
    maxFiles,
    maxSize,
  });

  const removeFile = (indexToRemove: number) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = value.filter((_, index) => index !== indexToRemove);
      onChange(newFiles);

      const newPreviews = [...previews];
      URL.revokeObjectURL(newPreviews[indexToRemove]);
      newPreviews.splice(indexToRemove, 1);
      setPreviews(newPreviews);
    } else {
      onChange(null);

      if (previews.length > 0) {
        URL.revokeObjectURL(previews[0]);
        setPreviews([]);
      }
    }
  };

  const hasFiles =
    (multiple && Array.isArray(value) && value.length > 0) ||
    (!multiple && value) ||
    previews.length > 0;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`bg-content1 border-2 border-content3/30 hover:border-content3/80 rounded-xl p-4 text-center cursor-pointer transition-colors relative
          ${
            isDragActive ? "border-primary bg-primary/10" : "border-default-300"
          }
          ${error ? "border-danger" : ""}`}
      >
        <input {...getInputProps()} disabled={disabled} />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Spinner size="lg" color="primary" />
            <p className="text-sm mt-2">Procesando imagen(es)...</p>
          </div>
        ) : !hasFiles ? (
          <>
            <Icon
              icon="lucide:upload-cloud"
              className={`w-9 h-9 mx-auto mb-2 ${
                isDragActive ? "text-primary" : "text-default-400"
              }`}
            />
            <p className="text-default-600 text-sm">{label}</p>
            <p className="text-xs text-default-400 mt-2">
              {multiple
                ? `Hasta ${maxFiles} archivos. Máximo ${
                    maxSize / 1024 / 1024
                  }MB cada uno.`
                : `Tamaño máximo de archivo: ${maxSize / 1024 / 1024}MB`}
            </p>
          </>
        ) : (
          <div className="w-full">
            {multiple ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <Card key={index} className="relative group" isFooterBlurred>
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                      removeWrapper
                    />
                    <CardFooter className="justify-center space-x-2 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 bg-background/60">
                      <Button
                        className="text-tiny text-white bg-black/20"
                        color="danger"
                        radius="lg"
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => removeFile(index)}
                      >
                        <Icon icon="lucide:x" className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-white truncate max-w-lg">
                        {value && Array.isArray(value) && value[index]
                          ? value[index].name || `Imagen ${index + 1}`
                          : `Imagen ${index + 1}`}
                      </span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="relative group">
                <Image
                  src={previews[0]}
                  alt="Preview"
                  className="w-full h-[50vh] object-cover"
                  removeWrapper
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="ghost"
                  isDisabled={disabled}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onPress={() => removeFile(0)}
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </Button>
              </Card>
            )}
            <p className="text-xs text-default-400 mt-2 text-center">
              {multiple
                ? "Arrastra más imágenes para añadir"
                : "Arrastra una nueva imagen para reemplazar"}
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-danger text-small mt-2">{error.message}</p>}
    </div>
  );
};
