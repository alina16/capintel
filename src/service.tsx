import axios from "axios";

const http = axios.create({
  baseURL: "/v1",
  headers: {
    "Content-type": "application/json"
  }
});

const get = (ticker: string) => {
    return http.get(`/stocks/${ticker}`);
};

const Service = {
    get,
};
  
export default Service;