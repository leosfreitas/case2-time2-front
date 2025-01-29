import { config } from "@/config/config";

export async function createAcordo(pacoteId: string) {
  let { apiBaseUrl } = config;
  let requestRoute = "/user/acordo/create";

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials, // Mantém a autenticação via cookies
    body: JSON.stringify({ pacote_id: pacoteId }),
  };

  // Faz a requisição corretamente
  let response = await fetch(apiBaseUrl + requestRoute, options);

  // Verifica se a requisição foi bem-sucedida
  if (!response.ok) {
    throw new Error("Erro ao criar acordo: " + response.statusText);
  }

  // Converte a resposta para JSON e retorna
  let jsonResponse = await response.json();
  return jsonResponse;
}
