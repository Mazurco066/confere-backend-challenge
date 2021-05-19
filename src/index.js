// Express app
const initApp = require('./app')
const { config } = require('dotenv')

// Setup env
config()

// Starting the API
initApp().then(server => {

  // Server listen
  server.listen(process.env.PORT || 3001, () => {
    console.log(`Confere backend is running on http://localhost:${process.env.PORT || 3001}`)
  })

// Error during inicialization
}).catch(err => {
  console.error('Error while starting the API: ' + err.message)
})