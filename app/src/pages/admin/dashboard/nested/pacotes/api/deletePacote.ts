import { config } from "@/config/config";

export async function deletePacote(pacoteId: string) {
  const { apiBaseUrl } = config;
  const requestRoute = `/pacote/delete/${pacoteId}`;

  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials, 
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao deletar pacote: " + response.statusText);
  }

  return await response.json();
}
