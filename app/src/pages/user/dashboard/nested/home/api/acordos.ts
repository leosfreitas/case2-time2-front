import { config } from "@/config/config";

export async function getMyAcordos() {
  const { apiBaseUrl } = config;
  const response = await fetch(`${apiBaseUrl}/user/acordo/get`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar acordos: " + response.statusText);
  }

  return await response.json();
}

export async function getPacoteAcordoDetail(pacoteId: string) {
  const { apiBaseUrl } = config;
  const response = await fetch(`${apiBaseUrl}/pacote/get/${pacoteId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do pacote: " + response.statusText);
  }

  return await response.json();
}

export async function deleteAcordo(acordoId: string) {
  const { apiBaseUrl } = config;
  const response = await fetch(`${apiBaseUrl}/user/acordo/delete/${acordoId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao cancelar contrato: " + response.statusText);
  }

  return await response.json();
}
