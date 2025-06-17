import GitHubCommits from "../../components/pages/admin/GitHubCommits";
import StatsCards from "../../components/pages/admin/StatsCards";
import HeaderPage from "../../components/shared/layout/HeaderPage";

export default function AdminPage() {
  return (
    <div>
      <HeaderPage
        title="Panel de administración"
        description="Controla desde aquí todo el contenido de tu portafolio."
      />
      <StatsCards />
      <div className="mt-6 px-8">
        <GitHubCommits />
      </div>
    </div>
  );
}
