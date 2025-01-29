import { config } from "@/config/config";
import { Phone } from "lucide-react";

export async function getUserData(): Promise<any> {
  const { apiBaseUrl } = config;
  const requestRoute = "/user/data";

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    throw new Error("Erro ao obter dados do avaliador");
  }
  const data = await response.json();
  console.log("Dados do avaliador obtidos com sucesso:", data);
  return data.data;
}
