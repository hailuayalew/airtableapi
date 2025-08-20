import axios from "axios";

// Replace with your actual environment variables
const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
const tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME;

const api = axios.create({
  baseURL: `https://api.airtable.com/v0/${baseId}/${tableName}`,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
});

export default api;
