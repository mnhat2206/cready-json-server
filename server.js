const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const db = router.db;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(jsonServer.bodyParser);


// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

server.post('/login', (req, res) => {
    const userData = req.body
    const checkLogin = db.get('users').find((user => {
        return user.username === userData.username && user.password === userData.password
    })).value();
    if (checkLogin) {
        const accessToken = db.get('token').value()[0]
        return res.json(accessToken)
    }

    return res.status(400).json({
        errorMessage: 'Incorrect username or password.',
    });
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

const PORT = process.env.PORT || 4000
// Use default router
server.use(router)
server.listen(PORT , () => {
  console.log('JSON Server is running')
})