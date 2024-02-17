import { jwtDecode } from "jwt-decode";
import { speFetch } from "./Services";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function getToken() {
    const localToken = localStorage.getItem("pat");
    const decodedToken = jwtDecode(localToken);
    const { exp: expirationTimestamp } = decodedToken;
    const nowTimestamp = new Date().getTime() / 1000;
    if (nowTimestamp < expirationTimestamp) {
        console.log("Token valid");
        return localToken;
    }
    return await requestAccessToken();
}

async function requestAccessToken() {
    console.log("Request accessToken çalıştı");
    const newToken = await getNewToken();
    localStorage.setItem("pat", newToken);
    return newToken;
}

export async function customPubFetch(url, options) {
    const token = await getToken();

    const response = await fetch(BASE_URL+url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });

    return response;
}

const getNewToken = async () => {
    console.log("get New Token Start");
    const localRefreshToken = localStorage.getItem("prt");
    console.log("Local Refresh Token:", localRefreshToken);

    const requestBody = JSON.stringify({ token: localRefreshToken });
    console.log("Request Body:", requestBody);

    if (localRefreshToken !== null && localRefreshToken !== undefined) {
        const response = await speFetch("/api/pub-token", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
        });

        console.log("Response:", response);
        if (response.ok) {
            const data = await response.json();
            console.log("Response Data:", data);
    
            // Yeni access token ve refresh token'ı localStorage'e kaydet
            localStorage.setItem("pat", data.accessToken);
            localStorage.setItem("prt", data.refreshToken); // Yeni refresh token'ı kaydet
    
            return data.accessToken;
        }
    }
};

