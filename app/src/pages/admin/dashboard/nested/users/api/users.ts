import { config } from "@/config/config";

export async function getAllUsers() {
  const { apiBaseUrl } = config;
  const requestRoute = "/users/get"; 

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários: " + response.statusText);
  }

  const jsonResponse = await response.json();
  return jsonResponse; 
}

export async function deleteUser(userId: string) {
  const { apiBaseUrl } = config;
  const requestRoute = `/user/delete/${userId}`;

  const options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials, 
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao deletar usuário: " + response.statusText);
  }

  return await response.json();
}
