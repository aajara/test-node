import express from 'express'
import Axios from 'axios'

const product = require('../controllers/producto')
const router = express.Router()
const client = require('../database')



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

  skus = "[2000373380547,2000373057739,2000369527338,2000372408112,2000373604469,2000373433229,2000373430853,2000372403506,2000373056725,2000373605732,2000370969035,    2000374171670,2000373434585,2000373374676,2000372403599,2000373376502,2000373606197,2000372407979,2000374171816,2000375529876,2000373680494,2000373375932,2000373606760,2000373351691,2000373342491]"

    try {
        let data = await product.productos(skus)
        resp.json(data.data.data)
      } catch (error) {
        console.log("Error : " + error.message)
      }
})
router.get('/producto/:id', async (req, resp) => {
    try {
      const data = await product.producto(req.params.id)
      resp.json(data.data.data)
    } catch (error) {
      console.log("Error : " + error.message)
    }
  })

module.exports = router