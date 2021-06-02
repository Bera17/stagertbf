import axios from "axios";
import { authHeader } from "./authentification";

const client = axios.create({
    baseURL: "http://localhost:3100/api/metadata",
  });

  const retrieve = () => {
    return client.get("/", { headers: authHeader() }).then((r) => r.data);
  };

  export { retrieve }