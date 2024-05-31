import { useState } from 'react';

const BASE_URL = 'https://api.prokerala.com/';

const useApiClient = (clientId:any, clientSecret:any) => {
    const [accessToken, setAccessToken] = useState(null);

    const getAccessToken = async () => {
        const response = await fetch(`${BASE_URL}token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch access token');
        }

        const tokenData = await response.json();
        setAccessToken(tokenData.access_token);
    };

    const get = async (endpoint:any, params:any) => {
        if (!accessToken) {
            await getAccessToken();
        }

        const url = new URL(`${BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        return response.json();
    };

    return {
        get,
    };
};

export default useApiClient;
