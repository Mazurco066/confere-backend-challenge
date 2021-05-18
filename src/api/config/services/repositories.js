/**
 * Setup repositores with dependencies
 * @param {*} connection - mongodb connection
 * @returns {object} instanced repositories
 */
module.exports = (connection) => {

  // Returning repositores, queries and services
  return {
    repositories: { },
    queries: { },
    services: { }
  }
}