import axios from "axios";
import { AIO_USERNAME,AIO_KEY,FEED_NAME } from "../config/adafruitConfig";

//criando instância do axios configurada para Adafruit
const api = axios.create({
    baseURL: `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/`,
    headers:{
        "X-AIO-Key": AIO_KEY,
        "Content-Type": "application/json"
    },
    //qualquer resposta fora de 2xx (ex: 401, 403, 500) dispara erro
    validateStatus: (status) => status >= 200 && status < 300
})

const adafruit = {
    getUltimaTemperatura: () => api.get(`${FEED_NAME}/data/last`),
    enviarTemperatura: (valor) => api.post(`${FEED_NAME}/data`, { value: String(valor) })
}

export default adafruit;