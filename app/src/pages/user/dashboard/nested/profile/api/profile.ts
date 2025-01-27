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
  return data;
}

export async function updateUserData(
    name: string,
    email: string,
    cpf: string,
    phone: string
  ): Promise<{ response: Response; responseData: any }> {
    const { apiBaseUrl } = config;
    const requestRoute = "/user/update/data";
  
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, cpf, phone }),
      credentials: "include" as RequestCredentials,
    };
  
    const response = await fetch(apiBaseUrl + requestRoute, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao atualizar dados");
    }
    const responseData = await response.json();
    console.log("Dados do avaliador atualizados com sucesso:", responseData);
    return { response, responseData };
  }
  