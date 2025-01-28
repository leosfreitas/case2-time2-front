import { config } from "@/config/config";

export async function login(email: string, password: string): Promise<{ response: Response }> {
    let { apiBaseUrl } = config;
    let requestRoute = '/user/auth/login'; 
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        credentials: 'include' as RequestCredentials,
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);

    if (!response.ok) {
        throw new Error('Erro no login');
    }

    let data = await response.json();
    console.log('Login bem-sucedido:', data);

    return { response };
}
