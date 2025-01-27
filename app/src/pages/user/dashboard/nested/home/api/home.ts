import { config } from "@/config/config";

export async function getGraphic1(): Promise<any> {
    let { apiBaseUrl } = config;
    let requestRoute = '/user/get-graphic-1';
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' as RequestCredentials,
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);
    if (!response.ok) {
        throw new Error('Erro ao buscar gráfico 1');
    }

    let data = await response.json();
    console.log('Dados do gráfico 1:', data);
    return data;
}

export async function getGraphic2(): Promise<any> {
    let { apiBaseUrl } = config;
    let requestRoute = '/user/get-graphic-2';
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' as RequestCredentials,
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);
    if (!response.ok) {
        throw new Error('Erro ao buscar gráfico 2');
    }

    let data = await response.json();
    console.log('Dados do gráfico 2:', data);
    return data;
}

export async function getGraphic3(): Promise<any> {
    let { apiBaseUrl } = config;
    let requestRoute = '/user/get-graphic-3';
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' as RequestCredentials,
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);
    if (!response.ok) {
        throw new Error('Erro ao buscar gráfico 3');
    }

    let data = await response.json();
    console.log('Dados do gráfico 3:', data);
    return data;
}

export async function getGraphic4(): Promise<any> {
    let { apiBaseUrl } = config;
    let requestRoute = '/user/get-graphic-4';
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' as RequestCredentials,
    };

    let response = await fetch(apiBaseUrl + requestRoute, options);
    if (!response.ok) {
        throw new Error('Erro ao buscar gráfico 4');
    }

    let data = await response.json();
    console.log('Dados do gráfico 4:', data);
    return data;
}
