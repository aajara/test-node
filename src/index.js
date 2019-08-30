'use strict'

import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors'

const app = express()

// Configuracion Puerto

app.set('port', process.env.PORT || 8021)

// Middlewares 

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())


// Rutas

app.use('/api/',require('./rutas/api.rutas'))

// Recursos

app.use(express.static(path.join(__dirname,'public')))

// Arranque del Servidor
app.listen(app.get('port') ,() => {

    console.log(`Escucha desde Puerto: ${app.get('port')}`)

})