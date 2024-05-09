const express = require('express')
const morgan = require("morgan");

// Middleware customizado
const myFirstMiddleware = (req, res, next) => {
  console.log('Middleware function')
  console.log(req.body)
  //No permito continuar con la petición si esta condición se cumple
  if (req.body.status === 'Not Done') {
    res.send('Aquí no permitimos gandules')
  } else {
    // Los middlewares necesitan ejecutar el parámetro 'next' para ejecutar la siguiente función definida en la ruta
    next()
  }
}

const mySecondMiddleware = (req, res, next) => {
  // La función next siempre será el 3 parámetro recogido en el middleware
  console.log('De locos')
  next()
}

const app = express()

// Middlewares aplicados a todas las rutas
app.use(express.text()) //Traducir texto puro que llega desde postman para que javascript lo entienda
app.use(express.json()) //Traducir los json que me llegan desde postman
app.use(express.static('public')) // Definición de la carpeta que contiene los archivos estáticos (imágenes, textos, pdf, etc)
app.use(morgan('dev'))


app.get("/", function (req, res) {
  res.send("Welcome to my API");
});

// myFirstName es un middle aplicado específicamente a esta ruta
app.get('/todos', myFirstMiddleware, function(req, res) {
  res.send('Recibido')
})

// Esta ruta aplica dos middleware antes de ejecutar su función 'final'
app.post("/todos", myFirstMiddleware, mySecondMiddleware, function (req, res) {
  const body = req.body
  res.send(`El todo ${body.description} ha sido creado con status ${body.status}`);
})

app.get("/users", (req, res) => {
  // El primer parámetro (req) SIEMPRE hará referencia a la información de la petición
  // El segundo parámetro (res) SIEMPRE hará referencia a la información de la respuesta
  console.log(req.query)
  res.send("All users");
});

app.get('/users/profile', function(req, res) {
  // Usamos res.send para devolver una string al cliente (Postman)
  res.send('Your profile')
})

app.get("/users/:id", function (req, res) {
  // Usamos res.json para devolver un objeto al cliente (Postman)
  res.json(req.params)
})

app.post("/users", function (req, res) {
  res.send('User created')
});

// El primer parámetro (en este caso 3000) de la función 'listen' define qué puerto debe utilizar nuestro host (de momento será localhost) para ejecutar este servicio
// La función 'listen' es la encargada de permitir arrancar nuestro servido y se quede activo, esperando cualquier petición que nos llegue a http://localhost:3000
app.listen(3000, () => {
  console.log('Servidor arrancado. Golisneando en el puerto 3000')
})