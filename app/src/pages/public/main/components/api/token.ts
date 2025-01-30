import { config } from "@/config/config";

export async function checkAdminToken(): Promise<{ response: Response }> {
    let { apiBaseUrl } = config;
    let requestRoute = '/admin/auth/check/token';
    let options = {
        method: 'POST',
        credentials: 'include' as RequestCredentials,
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);

    if (!response.ok) {
        throw new Error('Token inválido ou expirado');
    }

    let data = await response.json();
    console.log('Token verificado com sucesso:', data);

    return { response };
}

export async function checkUserToken(): Promise<{ response: Response }> {
    let { apiBaseUrl } = config;
    let requestRoute = '/user/auth/check/token';
    let options = {
        method: 'POST',
        credentials: 'include' as RequestCredentials,
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);

    if (!response.ok) {
        throw new Error('Token inválido ou expirado');
    }

    let data = await response.json();
    console.log('Token verificado com sucesso:', data);

    return { response };
}
