import axios from "axios";

const client = axios.create({
    baseURL: "https://localhost:3100/api/metadata",
  });

  const retrieve = () => {
    return client.get("/").then((r) => r.data);
  };

  export { retrieve }