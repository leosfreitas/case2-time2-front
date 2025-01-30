import { config } from "@/config/config";

export async function getAdminData(): Promise<any> {
  let { apiBaseUrl } = config;
  let requestRoute = "/admin/data";

  let options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    throw new Error("Erro ao obter dados do avaliador");
  }
  let data = await response.json();
  console.log("Dados do avaliador obtidos com sucesso:", data);
  return data.data;
}

export async function updateAdminData(
    name: string,
    email: string,
    cpf: string,
    phone: string
  ): Promise<{ response: Response; responseData: any }> {
    let { apiBaseUrl } = config;
    let requestRoute = "/admin/update/data";
  
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, cpf, phone }),
      credentials: "include" as RequestCredentials,
    };
  
    let response = await fetch(apiBaseUrl + requestRoute, options);
    if (!response.ok) {
      let errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao atualizar dados");
    }
    let responseData = await response.json();
    console.log("Dados do avaliador atualizados com sucesso:", responseData);
    return { response, responseData };
  }
