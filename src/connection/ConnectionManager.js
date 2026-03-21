import axios from "axios";

class ConnectionManager {
  constructor(config = {}) {
    this.config = {
      accountId: "108931606752",
      region: "ap-south-1",
      apiGatewayBaseUrl: import.meta.env.VITE_API_URL || "https://l25wiszwb5.execute-api.ap-south-1.amazonaws.com/prod",
      requestTimeout: 15000,
      enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "true",
      ...config
    };

    this.axiosInstance = axios.create({
      timeout: this.config.requestTimeout,
      headers: {
        "Content-Type": "application/json"
      }
    });

    this.axiosInstance.interceptors.request.use(
      config => {
        if (this.config.enableLogging) console.log("?? API Request:", config.url);
        return config;
      },
      error => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      response => {
        if (this.config.enableLogging) console.log("?? API Response:", response.status);
        return response;
      },
      error => {
        console.error("? API Error:", error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  async callInfraAPI() {
    try {
      const url = `${this.config.apiGatewayBaseUrl}/infra`;
      console.log("?? Calling:", url);

      const response = await this.axiosInstance.get(url);

      console.log("? API Response received:", response.data);

      return response.data;
    } catch (error) {
      console.error("? Failed to fetch infra:", error.message);
      throw error;
    }
  }

  getAccountInfo() {
    return {
      accountId: this.config.accountId,
      region: this.config.region,
      apiUrl: this.config.apiGatewayBaseUrl
    };
  }
}

let connectionInstance = null;

export const initializeConnection = (config) => {
  connectionInstance = new ConnectionManager(config);
  console.log("? Connection initialized:", connectionInstance.getAccountInfo());
  return connectionInstance;
};

export const getConnection = () => {
  if (!connectionInstance) connectionInstance = new ConnectionManager();
  return connectionInstance;
};
