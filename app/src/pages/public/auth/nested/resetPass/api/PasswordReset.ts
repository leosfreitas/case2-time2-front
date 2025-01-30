import { config } from "@/config/config";

export async function resetPassword(token: string, password: string): Promise<{ response: Response }> {
    let { apiBaseUrl } = config;
    let requestRoute = '/auth/reset-password'; 
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            token: token, 
            password: password 
        }),
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);

    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Erro ao redefinir a senha.';
        if (contentType && contentType.includes('application/json')) {
            const { message } = await response.json();
            errorMessage = message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return { response };
}
