import { config } from "@/config/config";

export async function getAllPacotes() {
  let { apiBaseUrl } = config;
  let requestRoute = "/pacotes/get";

  let response = await fetch(apiBaseUrl + requestRoute, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar pacotes: " + response.statusText);
  }

  let jsonResponse = await response.json();
  return jsonResponse;

}
