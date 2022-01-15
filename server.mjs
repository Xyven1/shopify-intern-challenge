import express from 'express'
import cors from 'cors'
import compression from 'compression'
import path from 'path'
import greenlock from 'greenlock-express'

const app = express()
//middleware
app.use(cors())
app.use(compression())
app.use(express.static('./dist'))

//serves static files in dist
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(path.resolve(), './dist/index.html'))
})

// greenlock.init({
//   packageRoot: path.resolve(),
//   configDir: './greenlock.d',
//   maintainerEmail: 'babruell@wpi.edu',
//   cluster: false,
// }).serve(app)

const port = process.env.PORT || 3000
server.listen(port, () =>{
    console.log(`app is listening on port: ${port}`)
})