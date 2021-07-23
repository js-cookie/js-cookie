const nodeStatic = require('node-static')
const file = new nodeStatic.Server('./dist')
const port = 8080

require('http')
  .createServer(function (request, response) {
    request
      .addListener('end', function () {
        file.serve(request, response)
      })
      .resume()
  })
  .listen(port)

console.log(`Example available at http://localhost:${port}`)
