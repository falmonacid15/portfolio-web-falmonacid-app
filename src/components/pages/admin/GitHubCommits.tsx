import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Spinner, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { getGithubPersonalToken } from "../../../config/env";
import { Octokit } from "octokit";

const octokit = new Octokit({ auth: getGithubPersonalToken() });

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

export default function GitHubCommits() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const owner = "falmonacid15";
  const repo = "porfolio-web-falmonacid";

  // useEffect(() => {
  //   const fetchCommits = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await octokit.request(
  //         `GET /repos/${owner}/${repo}/commits`,
  //         {
  //           owner,
  //           repo,
  //           per_page: 5,
  //         }
  //       );

  //       console.log(response.data);
  //     } catch (err) {
  //       const errorMessage = axios.isAxiosError(err)
  //         ? `GitHub API error: ${err.response?.status} - ${
  //             err.response?.data?.message || err.message
  //           }`
  //         : "Error fetching commits";

  //       setError(errorMessage);
  //       console.error("Failed to fetch GitHub commits:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCommits();
  // }, []);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:git-branch" className="text-xl text-primary" />
          <h3 className="text-lg font-semibold">Últimos Commits</h3>
        </div>
        <Chip color="primary" variant="flat" size="sm">
          master
        </Chip>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner color="primary" />
          </div>
        ) : error ? (
          <div className="text-danger text-center py-4">
            <Icon icon="lucide:alert-circle" className="text-2xl mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="border-b border-divider pb-3 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {commit.author ? (
                      <img
                        src={commit.author.avatar_url}
                        alt={commit.author.login}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon icon="lucide:user" className="text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {commit.commit.message.split("\n")[0]}
                    </a>
                    <div className="flex items-center gap-2 mt-1 text-sm text-foreground/60">
                      <span>{commit.commit.author.name}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(
                          new Date(commit.commit.author.date),
                          {
                            addSuffix: true,
                            locale: es,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <a
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-primary"
                  >
                    <Icon icon="lucide:external-link" className="text-lg" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
