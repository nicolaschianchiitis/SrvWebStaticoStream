// Moduli utilizzati
const http = require('http')
// const fs = require('fs')
const fs = require('fs').promises
const path = require('path')

// Parametri server
const hostname = "127.0.0.1"
const port = 3000

// Oggetto risolutore del MIME type, data l'estensione file
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
    '.json': 'application/json',
    '.js': 'text/javascript',
    '.md': 'text/markdown'
}

// Oggetto risolutore delle path dei file, fornito l'URL della richiesta
const filePaths = {
    '/': './public/html/index.html',
    '/css': './public/css/style.css',
    '/logo_olimpiadi': './public/img/logo_olimpiadi.png',
    '/discipline': './public/html/discipline.html',
    '/edizioni': './public/html/edizioni.html'
}

async function requestHandler(req, res) {
    console.log(`>>> Richiesta in entrata: ${req.url}`)
    let reqPath = filePaths[req.url]
    let extension = path.extname((reqPath == undefined ? '' : reqPath))
    let encoding = (extension == '.jpeg' || extension == '.png') ? '' : 'utf-8'

    // Versione con async/await
    try {
        const data = await fs.readFile((reqPath == undefined ? '' : reqPath), {'encoding': encoding})
        res.writeHead(200, {'Content-Type': mimeTypes[extension]})
        res.write(data)
        res.end()
    } catch (err) {
        res.writeHead(404, { 'Content-Type': mimeTypes['.html'] })
        res.write(`<center><h1 style="border: 4px solid red;">Errore 404: risorsa non trovata.</h1></center>`)
        res.end()
    }

    /* // Versione con funzioni asincrone e callback
    fs.readFile((reqPath == undefined ? '' : reqPath), {'encoding': encoding}, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': mimeTypes['.html'] })
            res.write(`<center><h1 style="border: 4px solid red;">Errore 404: risorsa non trovata.</h1></center>`)
            res.end()
        } else {
            res.writeHead(200, {'Content-Type': mimeTypes[extension]})
            res.write(data)
            res.end()
        }
    }) */
}

const server = http.createServer(requestHandler)

server.listen(port, hostname, function () {
    console.log(`Server in ascolto... http://${hostname}:${port}`)
})