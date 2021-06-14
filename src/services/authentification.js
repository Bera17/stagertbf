import axios from "axios";

const client = axios.create({
    baseURL: "https://localhost:3100/api/login",
  });

const login = async (email, password) => {
    return await client
            .post('', {email:email, password:password})
            .then((r)=> r.data);
}

const authHeader = () => {
  let token = localStorage.getItem('token');

  if (token) {
    return { 'x-access-token': token };
  } else {
    return {};
  }
}

export { login, authHeader }
