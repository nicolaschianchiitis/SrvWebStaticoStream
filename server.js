// Moduli utilizzati
const http = require('http')
const fs = require('fs')
const path = require('path')

// Parametri server
const hostname = "127.0.0.1"
const port = 3000

// Messaggi di errore
const err404 = '<center><h1 style="border: 2px solid red">Errore 404: risorsa non trovata.</h1></center>'
const err500 = '<center><h1 style="border: 2px solid red">Errore 500: errore interno del server.</h1></center>'

// Oggetto risolutore del MIME type, data l'estensione file
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
    '.json': 'application/json',
    '.js': 'text/javascript',
    '.md': 'text/markdown',
    '.mp4': "video/mp4"
}

// Oggetto risolutore delle path dei file, fornito l'URL della richiesta
const filePaths = {
    '/': './public/html/index.html',
    '/css': './public/css/style.css',
    '/logo_olimpiadi': './public/img/logo_olimpiadi.png',
    '/discipline': './public/html/discipline.html',
    '/edizioni': './public/html/edizioni.html',
    '/video_pista_atletica': './public/video/video_pista_atletica.mp4'
}

/*
    Attenzione!
    Questo metodo "universale" funziona perfettamente
    con Chrome (e suppongo anche browser basati su
    Chromium) e Firefox (anche qua, suppongo anche
    coi svariati fork). In generale, funziona
    senza troppe seccature.
    Safari, come al solito, richiede un trattamento
    più delicato, ovvero quello di gestire manualmente
    la risposta del server, con codice 206 (partial
    content) e bisogna gestire l'header Range della
    richiesta per inviare i byte richiesti.
*/

function requestHandler(req, res) {
    console.log(`~~~> Richiesta in entrata: ${req.url}`)

    if (filePaths.hasOwnProperty(req.url)) {
        const filePath = filePaths[req.url]
        const contentType = mimeTypes[path.extname(filePath)] || 'application/octet-stream'
        // Creazione stream di lettura per il file
        const fileStream = fs.createReadStream(filePath)

        // Preparazione header 200 OK (Success)
        res.writeHead(200, {'Content-Type': contentType})

        // Gestione eventuali errori
        fileStream.on('error', function(err) {
            console.error(`!! Errore ${err.code}. Messaggio: ${err.message}`)
            if (err.code === 'ENOENT') {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end(err404)
            } else {
                res.writeHead(500, {'Content-Type': 'text/html'})
                res.end(err500)
            }
        })

        // Scriviamo i dati direttamente nella risposta e inviamo una volta finito
        fileStream.pipe(res)

        // Versione alternativa
        /*
            Carichiamo i dati in memoria a piccoli blocchetti (chunk)
            e scriviamo man mano nella risposta
        */
        /* fileStream.on('data', function(chunk) {
            res.write(chunk)
        }) */

        // Inviamo la risposta al client una volta finito
        /* fileStream.on('end', function() {
            res.end()
        }) */
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end(err404)
    }
}

const server = http.createServer(requestHandler)

server.listen(port, hostname, function () {
    console.log(`Server in ascolto... http://${hostname}:${port}`)
})