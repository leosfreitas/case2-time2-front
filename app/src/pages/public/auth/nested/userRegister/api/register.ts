import { config } from "@/config/config";

export async function registerRequest(formData: {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
}): Promise<Response> {
  let { apiBaseUrl } = config;
  let requestRoute = '/user/auth/register';

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  };

  let response = await fetch(apiBaseUrl + requestRoute, options);

  if (!response.ok) {
    throw new Error('Erro ao realizar o cadastro');
  }

  return response;
}
