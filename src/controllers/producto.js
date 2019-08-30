import Axios from 'axios'

const config = require('../config/config')
const client = require('../database')


const getRandomArbitrary = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const productos = (skus) => {
    return new Promise(async (resolve, rejects) => {

        let data = await getProductos(skus)
        console.log(data)
        resolve(data)
    })
}

const producto = (sku) => {
    return new Promise(async (resolve, rejects) => {

        client.get(sku, async function (error, result) {

            if (error || !result) {

                console.log("retorno desde servicio")
                let data = await getDetailProducto(sku)
                client.setex(sku, 60, JSON.stringify(data.data.data))
                resolve(data);

            } else {

                console.log("retorno desde redis")
                resolve({ status: "success", data: { data: JSON.parse(result) } })

            }

        });
    })
}

const getProductos = async (skus) => {

    const number = getRandomArbitrary(1, 11)
    console.log("Generando nuemero: " + number)

    if (number === 7) {

        getProductos(sku);
        console.log("Ha ocurrido un error, reintentando ...")
    }

    try {

        const data = await Axios.get(`${config.api}${config.endpoints.productos}${skus.join(",")}`)

        return {
            data: data,
            status: "success"
        }

    } catch (error) {
        return {
            message: error.message,
            status: "error"
        }
    }
}

const getDetailProducto = async (sku) => {

    const number = getRandomArbitrary(1, 11)
    console.log("Generando nuemero : " + number)

    if (number === 7) {

        getProductos(sku);
        console.log("Ha ocurrido un error, reintentando ...")
    }

    try {

        const data = await Axios.get(`${config.api}${config.endpoints.producto}${sku}`)
        return {

            data: data,
            status: "success"

        }

    } catch (error) {

        return {

            message: error.message,
            status: "error"

        }

    }
}

module.exports = {productos, producto}