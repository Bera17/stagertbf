import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:3100/api/canaux",
  });

  const retrieve = () => {
    return client.get("/").then((r) => r.data.canaux);
  };

  export { retrieve }