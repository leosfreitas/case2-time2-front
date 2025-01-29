// contatoUserRequests.ts

import { config } from "@/config/config";


export async function getAllUserContatos() {
  const { apiBaseUrl } = config;
  const requestRoute = "/user/contato/get";

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials, 
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao buscar contatos do usuário: " + response.statusText);
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}


export async function createUserContato(data: any) {
  const { apiBaseUrl } = config;
  const requestRoute = "/user/contato/create";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
    body: JSON.stringify(data),
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao criar contato: " + response.statusText);
  }

  return await response.json();
}


export async function deleteUserContato(contatoId: string) {
  const { apiBaseUrl } = config;
  const requestRoute = `/user/contato/delete/${contatoId}`;

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
