const jsonServer = require('json-server')

// import user generator
const users = require('./users')

const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = process.env.port || 3000

server.use(jsonServer.bodyParser)
server.use(middlewares)
server.listen(port, () => {
  console.log('JSON server is running')
})

// register user endpoint
server.get('/users', users)