import LoginForm from "../../../components/forms/LoginForm";
import { ThemeSwitcher } from "../../../components/shared/ThemeSwitcher";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center h-[90vh]">
      <div className="flex w-full justify-end px-8 py-4">
        <ThemeSwitcher />
      </div>
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="flex w-full max-w-md flex-col gap-4 rounded-lg px-8 pb-10 pt-6 border-2 border-foreground/60">
          <div className="flex flex-col items-center pb-6">
            <div className="flex mb-2 justify-center items-center text-foreground w-16 h-16 text-2xl font-bold bg-primary p-2 rounded-lg">
              <span>{`<...>`}</span>
            </div>
            <p className="text-2xl font-bold">Panel de administracion</p>
            <p className="text-sm text-foreground/60 font-semibold">
              Portafolio web de Felipe Almonacid
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
