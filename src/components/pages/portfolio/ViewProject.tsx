import { Image } from "@heroui/react";
import { Project } from "../../../interfaces/models/Project";

export default function ViewProject({
  name,
  shortDescription,
  longDescription,
  mainImage,
  images,
  languages,
  techonologies,
}: Project) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-base font-medium text-foreground/60">
          {shortDescription}
        </p>
        <p className="text-sm font-medium text-foreground/90">
          {longDescription}
        </p>
      </div>

      <Image src={mainImage} alt={name} />
      <div>
        {images.map((image) => (
          <Image key={image} src={image} alt={name} />
        ))}
      </div>
      <div>
        <h2>Lenguajes</h2>
        {languages.map((language) => (
          <p key={language}>{language}</p>
        ))}
      </div>
      <div>
        <h2>Tecnologias</h2>
        {/* {techonologies.map((techonology) => (
          <p key={techonology}>{techonology}</p>
        ))} */}
      </div>
    </div>
  );
}
