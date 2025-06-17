export default function AppIcon() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex justify-center items-center text-foreground w-10 h-10 text-sm font-bold bg-primary p-2 rounded-lg">
        <span>{`<...>`}</span>
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-bold">Panel de administracion</p>
        <p className="text-xs text-foreground/60 font-semibold">
          Portafolio web de Felipe Almonacid
        </p>
      </div>
    </div>
  );
}
