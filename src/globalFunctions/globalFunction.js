import axios from "axios";

// const apiBaseUrl = "https://ai.webvio.in/backend/backend";
// const token = "key_fefba4090316b557a67e930307bf"
const token = localStorage.getItem("token");
// const apiBaseUrl = "https://ai.webvio.in/backend/backend";
// const apiBaseUrl = "http://localhost:8000/backend";
const apiBaseUrl = "https://ai.webvio.in/backend-py";
const ai_token = "key_f3f8d64a285120a16182f6add20d"; // prod key
// const ai_token = "key_a083999b0156a43721cc1b5942a1"; //prtm token
// const apiBaseUrl = process.env.BACKEND_BASE_URL;
const pythonBaseurl = "https://ai.webvio.in/backend-py";
// const pythonBaseurl = "https://testing.webvio.in/backend/api/ai/";
console.log("token", token);
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `${ai_token}`,
    Authorization: `${token}`,
  },
});

if (token !== null) {
  axiosInstance.defaults.headers.common["Authorization"] = `${token}`;
}

const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// python POST method
export const pythonPostFunction = async (endpoint, data) => {
  try {
    const response = await axios.post(`${pythonBaseurl}${endpoint}`, data);
    if (endpoint === "login" && response.status) {
      setAuthToken(response.data.data.retail_api_key);
    }
    return response.data;
  } catch (error) {
    // console.error("Error: ", error);
    return error.response.data;
  }
};

// python Get method
export const pythonGetFunction = async (endpoint) => {
  try {
    const response = await axios.get(`${pythonBaseurl}${endpoint}`);
    return response.data;
  } catch (error) {
    // console.error("Error: ", error);
    return error.response.data;
  }
};

// General Get function
export const generalGetFunction = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    // console.error("Error: ", error);
    return error.response.data;
  }
};

// General Post function
export const generalPostFunction = async (endpoint, data) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  } catch (error) {
    // console.error("Error: ", error);
    return error.response.data;
  }
};

// General Put function
export const generalPutFunction = async (endpoint, data) => {
  try {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
  } catch (error) {
    // console.error("Error: ", error);
    return error.response.data;
  }
};

// General Delete function
export const generalDeleteFunction = async (endpoint) => {
  try {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  } catch (error) {
    // console.error("Error: ", error);
    return error.response.data;
  }
};

// General Patch function
export const generalPatchFunction = async (endpoint, data) => {
  try {
    const response = await axiosInstance.patch(endpoint, data);
    return response.data;
  } catch (error) {
    // console.error("Error: ", error);
    return error.response.data;
  }
};

// General File upload function
export const aiFileUploadFunction = async (endpoint, data) => {
  return axiosInstance
    .post(endpoint, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};
