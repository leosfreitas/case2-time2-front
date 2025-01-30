import { config } from "@/config/config";

export async function requestPasswordReset(email: string): Promise<{ response: Response }> {
    let { apiBaseUrl } = config;
    let requestRoute = '/auth/send-email-recovery'; 
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            email: email 
        }),
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);

    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Erro ao solicitar redefinição de senha.';
        if (contentType && contentType.includes('application/json')) {
            const { message } = await response.json();
            errorMessage = message || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return { response };
}
