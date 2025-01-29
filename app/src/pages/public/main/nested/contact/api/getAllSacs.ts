import { config } from "@/config/config";

export async function getAllSacs() {
  let { apiBaseUrl } = config;
  let requestRoute = "/sacs/get";

  let response = await fetch(apiBaseUrl + requestRoute, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar SACS: " + response.statusText);
  }

  let jsonResponse = await response.json();

  return jsonResponse.data;
}
