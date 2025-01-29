import { config } from "@/config/config";

export interface CreateSacDTO {
  nome: string;
  email: string;
  motivo: string;
  mensagem: string;
  resposta: string;
}

export async function createSac(data: CreateSacDTO) {
  let { apiBaseUrl } = config;
  let requestRoute = "/sac/create";

  let response = await fetch(apiBaseUrl + requestRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar SAC: " + response.statusText);
  }

  return response.json();
}
