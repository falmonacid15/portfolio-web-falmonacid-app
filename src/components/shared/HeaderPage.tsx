import CustomBreadcrumb from "./CustomBreadCrumb";

interface HeaderPageProps {
  title: string;
  description: string;
}

export default function HeaderPage({ title, description }: HeaderPageProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="text-sm font-normal">{description}</p>
      </div>
      <CustomBreadcrumb />
    </div>
  );
}
