import { config } from "@/config/config";

export async function createBudget(
  tipo: string,
  valor: string
): Promise<{ response: Response; responseData: any }> {
  let { apiBaseUrl } = config;
  let requestRoute = "/user/create-budget";

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tipo, valor }),
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    throw new Error("Erro ao criar budget");
  }
  let responseData = await response.json();
  console.log("Budget criada com sucesso:", responseData);
  return { response, responseData };
}

export async function getBudgets(): Promise<any[]> {
  let { apiBaseUrl } = config;
  let requestRoute = "/user/get-budgets";  

  let options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    throw new Error("Erro ao obter budgets");
  }
  let data = await response.json();
  console.log("Budgets obtidos com sucesso:", data);
  return data;
}

export async function deleteBudget(budgetId: string) {
  let { apiBaseUrl } = config;
  let requestRoute = `/user/delete-budget/${budgetId}`;

  let options = {
    method: "DELETE",
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);
  if (!response.ok) {
    let errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao deletar budget");
  }
  let data = await response.json();
  return data;
}
