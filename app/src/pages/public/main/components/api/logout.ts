import { config } from "@/config/config";

export async function AdminLogout(): Promise<void> {
  let { apiBaseUrl } = config;
  let requestRoute = '/admin/auth/logout';
  let options = {
    method: 'POST',
    credentials: 'include' as RequestCredentials,
  };

  try {
    let response = await fetch(apiBaseUrl + requestRoute, options);

    if (!response.ok) {
      throw new Error('Erro ao fazer logout: ' + response.statusText);
    }

    console.log('Logout realizado com sucesso');
  } catch (error) {
    console.error('Falha ao fazer logout:', error);
    throw error;
  }
}

export async function UserLogout(): Promise<void> {
    let { apiBaseUrl } = config;
    let requestRoute = '/user/auth/logout';
    let options = {
      method: 'POST',
      credentials: 'include' as RequestCredentials,
    };
  
    try {
      let response = await fetch(apiBaseUrl + requestRoute, options);
  
      if (!response.ok) {
        throw new Error('Erro ao fazer logout: ' + response.statusText);
      }
  
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Falha ao fazer logout:', error);
      throw error;
    }
  }
  