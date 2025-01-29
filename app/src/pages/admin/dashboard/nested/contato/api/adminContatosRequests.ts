// adminContatosRequests.ts
import { config } from "@/config/config";

export async function getAllAdminContatos() {
  const { apiBaseUrl } = config;
  const requestRoute = "/admin/contatos/get"; 

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao buscar contatos do admin: " + response.statusText);
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function editAdminContato(contatoId: string, data: any) {
  const { apiBaseUrl } = config;
  const requestRoute = `/admin/contato/edit/${contatoId}`; // Rota para editar a resposta

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
    body: JSON.stringify(data),
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao editar contato: " + response.statusText);
  }

  return await response.json();
}

export async function deleteAdminContato(contatoId: string) {
    const { apiBaseUrl } = config;
    const requestRoute = `/admin/contato/delete/${contatoId}`;
  
    const options = {
      method: "DELETE",
      credentials: "include" as RequestCredentials,
    };
  
    const response = await fetch(apiBaseUrl + requestRoute, options);
  
    if (!response.ok) {
      throw new Error("Erro ao deletar contato: " + response.statusText);
    }
  
    return await response.json();
  }