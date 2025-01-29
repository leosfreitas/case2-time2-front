import { config } from "@/config/config";

// 1) GET: Buscar todos os SACs
export async function getAllSacs() {
  let { apiBaseUrl } = config;
  let requestRoute = "/sacs/get";

  let options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao buscar SACs: " + response.statusText);
  }

  let jsonResponse = await response.json();

  return await jsonResponse.data;
}

// 2) PUT: Editar um SAC (adicionar resposta ou atualizar campos)
export async function editSac(sacId: string, data: any) {
  let { apiBaseUrl } = config;
  let requestRoute = `/sac/edit/${sacId}`;

  let options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao editar SAC: " + response.statusText);
  }

  return await response.json();
}

// 3) DELETE: Deletar um SAC
export async function deleteSac(sacId: string) {
  let { apiBaseUrl } = config;
  let requestRoute = `/sac/delete/${sacId}`;

  let options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao deletar SAC: " + response.statusText);
  }

  return await response.json();
}
