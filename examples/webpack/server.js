var nodeStatic = require('node-static')
var file = new nodeStatic.Server('./dist')
var port = 8080

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
