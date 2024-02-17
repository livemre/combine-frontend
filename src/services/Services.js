import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function getToken() {
   
    const localToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(localToken);
    const { exp: expirationTimestamp } = decodedToken;
    const nowTimestamp = new Date().getTime() / 1000;
    if (nowTimestamp < expirationTimestamp) {
    
        return localToken;
    }
    return await requestAccessToken();
}

async function requestAccessToken() {
    console.log("Request accessToken çalıştı");
    const newToken = await getNewToken();
    localStorage.setItem("accessToken", newToken);
    return newToken;
}

export async function customFetch(url, options) {
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

export async function speFetch(url, options) {
    

    const response = await fetch(BASE_URL+url, {
        ...options,
        headers: {
            ...options.headers,
           
        }
    });

    return response;
}



const getNewToken = async () => {
    console.log("get New Token Start");
    const localRefreshToken = localStorage.getItem("refreshToken");
    console.log("Local Refresh Token:", localRefreshToken);

    const requestBody = JSON.stringify({ token: localRefreshToken });
    console.log("Request Body:", requestBody);

    if (localRefreshToken !== null && localRefreshToken !== undefined) {
        const response = await speFetch("/api/token", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
        });

        console.log("Response:", response);
        if (response.ok) {
            const data = await response.json();
            console.log("Response Data:", data);
    
            // Yeni access token ve refresh token'ı localStorage'e kaydet
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken); // Yeni refresh token'ı kaydet
    
            return data.accessToken;
        }
    }
};

export function convertUtcToLocalTime(utcString) {
    const date = new Date(utcString);
    return date.toLocaleString();
  }
  


  export function formatDateAndTime(inputDateTime) {
    const dateObj = new Date(inputDateTime);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    const milliseconds = String(dateObj.getMilliseconds()).padStart(5, '0');
  

    const res =   `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
   return convertToTRLocalTime(res)
  }

  

 export function formatDateTimeWithoutSeconds(dateTimeStr) {
    const parts = dateTimeStr.split(' ');
    const date = parts[0];
    let time = parts[1];

    // Saat:minüte formatına dönüştür (saniyeleri kaldır)
    time = time.substring(0, 5);

    return `${date} ${time}`;
}

  export function sendUserLocalTime(date) {
    const currentTime = new Date();

    // Saat ve dakikayı iki basamaklı formatta ayarla
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const localTime = `${hours}:${minutes}`;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const postData = {
        localDate: date.split('.').reverse().join('-'), // 'GG.AA.YYYY' formatından 'YYYY-MM-DD' formatına çevir
        localTime,
        timeZone
    };

    return postData;
}


export function getCurrentDateFormatted() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() Ocak ayını 0 olarak döndürür
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  

  function convertToTRLocalTime(inputDateTime) {
    // Verilen tarihi JavaScript Date nesnesine çevirin
    const dateObj = new Date(inputDateTime);
  
    // Türkiye saat dilimine göre saat ekleyin (+3 saat)
    dateObj.setHours(dateObj.getHours() - 3);
  
    // Yıl, ay, gün, saat, dakika ve saniye bilgilerini alın
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  
    // Sonuç olarak dönüştürülen saat ve tarihi string olarak formatlayın
    const trLocalTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  
    return trLocalTime;
  }