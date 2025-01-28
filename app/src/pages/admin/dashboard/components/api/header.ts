import { config } from "@/config/config";

export async function getUserName() {
    let { apiBaseUrl } = config;
    let requestRoute = `/admin/headbar`;
  
    let options = {
      method: "GET",
      credentials: "include" as RequestCredentials, 
    };
  
    let response = await fetch(apiBaseUrl + requestRoute, options);
  
    if (!response.ok) {
      let errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao obter nome do admin");
    }
  
    let data = await response.json();
    return data;
  }
  