import { config } from "@/config/config";

export async function registerRequest(formData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  tipo: string; // Adicionando o tipo
  cpf?: string; // Tornando opcional
  cnpj?: string; // Tornando opcional
}): Promise<Response> {
  const { apiBaseUrl } = config;
  const requestRoute = '/user/auth/register';

  // Construir o corpo da requisição dinamicamente
  const bodyData = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    tipo: formData.tipo,
    ...(formData.tipo === "Pessoa" && { cpf: formData.cpf }), // Inclui CPF se tipo for Pessoa
    ...(formData.tipo === "Empresa" && { cnpj: formData.cnpj }), // Inclui CNPJ se tipo for Empresa
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData), // Enviar apenas os dados relevantes
  };

  const response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error('Erro ao realizar o cadastro');
  }

  return response;
}
