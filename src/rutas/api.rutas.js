import express from 'express'
import Axios from 'axios'

const router = express.Router()
const client = require('../database')
const lista = require('../skus')



const getNumeroRandom = (min, max) => {
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
                let data = await getDetallesProducto(sku)
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

    const number = getNumeroRandom(1, 11)
    console.log("Generando nuemero: " + number)

    if (number === 7) {

        getProductos(sku);
        console.log("Ha ocurrido un error, reintentando ...")
    }

    try {

        const data = await Axios.get(`https://simple.ripley.cl/api/v2/products?format=json&partNumbers=${skus.join(",")}`)

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

const getDetallesProducto = async (sku) => {

    const number = getNumeroRandom(1, 11)
    console.log("Generando nuemero : " + number)

    if (number === 7) {

        getProductos(sku);
        console.log("Ha ocurrido un error, reintentando ...")
    }

    try {

        const data = await Axios.get(`https://simple.ripley.cl/api/v2/products/${sku}`)
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


router.get('/', async (req, resp) => {

    try {
        let data = await productos(lista.skus)
        resp.json(data.data.data)
      } catch (error) {
        console.log("Error : " + error.message)
      }
})
router.get('/producto/:id', async (req, resp) => {
    try {
      const data = await producto(req.params.id)
      resp.json(data.data.data)
    } catch (error) {
      console.log("Error : " + error.message)
    }
  })

module.exports = router