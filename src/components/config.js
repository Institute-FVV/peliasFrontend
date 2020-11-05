module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.port,
    pelias_url: process.env.REACT_APP_PELIAS_URL || "https://pelias.endpoint.com"
}