import { config } from "@/config/config";

export type CreatePacoteDTO = {
  cliente: "Pessoa" | "Empresa";
  tipo: Array<"Residencial" | "Movel" | "Fixa">;
  preco: string;
  cortesia: string;
  nome: string;
  detalhes?: {
    Residencial?: {
      velocidade: string;
      tipo: "banda larga" | "fibra optica";
    };
    Movel?: {
      tamanho_do_plano: string;
      tipo: "4g" | "5g";
    };
  };
};

export async function createPacote(data: CreatePacoteDTO) {
  let { apiBaseUrl } = config;
  let requestRoute = "/pacote/create";
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error("Erro ao criar pacote: " + response.statusText);
  }

  return await response.json();
}
