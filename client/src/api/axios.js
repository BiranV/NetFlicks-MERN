import axios from "axios"

export default axios.create({
    baseURL: "https://netflicks-server.vercel.app/"
    // baseURL: "http://localhost:5000"
})