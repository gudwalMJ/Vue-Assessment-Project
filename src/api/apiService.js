// CRUD //
import axios from "axios";

const API_BASE_URL = "https://api.intern.d-tt.nl/api/houses";
const API_KEY = "ZElYa7AuVnCPjrsphMwKSIWqxvRG1F-L";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": API_KEY,
  },
});

export default {
  // Fetch all houses
  getHouses() {
    return apiClient.get("/");
  },

  // Fetch a single house by ID
  getHouseById(houseId) {
    return apiClient.get(`/${houseId}`);
  },

  // Create a new house listing
  createHouse(houseData) {
    return apiClient.post("/", houseData);
  },

  // Edit an existing house listing
  editHouse(houseId, houseData) {
    // Check if houseData is an instance of FormData
    if (houseData instanceof FormData) {
      // If so, let the browser set the Content-Type header automatically to handle boundary generation
      return apiClient.post(`/${houseId}`, houseData, {
        headers: {
          "X-Api-Key": API_KEY, // Ensure API key is included
          "Content-Type": "multipart/form-data", // This line is actually optional; axios/browser will set it correctly
        },
      });
    } else {
      // If not FormData, assume JSON
      return apiClient.post(`/${houseId}`, houseData);
    }
  },

  // Delete a house listing
  deleteHouse(houseId) {
    return apiClient.delete(`/${houseId}`);
  },

  // Upload an image for a house
  uploadHouseImage(houseId, imageData) {
    const formData = new FormData();
    formData.append("image", imageData);

    return apiClient.post(`/${houseId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
