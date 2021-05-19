// Dependencies
const { MongoClient } = require('mongodb')
const { compose, curry, andThen } = require('ramda')

// Connection object
module.exports = {
  /**
	 * Normalize connection parameters.
	 * @param {object} parameters - connection parameters: {protocol: string, address: string, port: string, user: string, password: string, dbName: string}
	 * @returns {object} normalized parameters.
	 */
	normalizeParameters: function (parameters) {
		return {
			protocol: parameters.protocol || 'mongodb://',
			address: parameters.address,
			port: parameters.port || '27017',
			user: parameters.user,
			password: parameters.password,
			dbName: parameters.dbName
		}
	},

	/**
	 * Generate mongoDb connection URL.
	 * @param {object} parameters - connection data.
	 * @returns {string} connection string.
	 */
	generateConnectionString: function(parameters) {
    // Verifying informed parameters
    if (!(parameters.protocol && parameters.address && parameters.port && parameters.user && parameters.password && parameters.dbName))
      throw Error('[ERRO] > lib.mongo.connection: missing connection data')
        
    // Returning connection string 
		return `${parameters.protocol}${parameters.user}:${parameters.password}@${parameters.address}${(parameters.protocol.endsWith('srv://') ? '' : ':' + parameters.port)}`
	},

	/**
	 * Get connection from mongoDb.
	 * @param {string} url - connection string.
	 */
	getConnection: function(url) {
		return new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
	},

	/**
	 * Get connection objects from mongoDb.
	 * @param {string} dbName - database name.
	 * @param {object} dbConnection - connection object from mongoDb.
	 * @returns {object} {conexao: object, dbConnection: object}
	 */
	getConnectionObject: curry(function (dbName, dbConnection) {
		return new Promise((resolve, reject) => {
			dbConnection.connect().then(dbConnection => {
				const connection = dbConnection.db(dbName)
				resolve({ connection, dbConnection })
			}).catch(err => reject(err))
		})
	}),

	/**
	 * Create indexes on mongoDb Collections.
	 * @param {Object} mongoConection - { connection: Object, dbConnection: Object }
	 */
	generateIndexes: function (mongoConection) {
		return new Promise(async (resolve) => {
      // Database indexes
			await mongoConection.connection.collection('Receivements').createIndex(
				{ id: 1 }, { unique: true, name: 'id' }
			)
			await mongoConection.connection.collection('Transactions').createIndex(
				{ id: 1 }, { unique: true, name: 'id' }
			)
      // Resolve promise
			resolve(mongoConection)
		})
	},

	/**
	 * Generate a connection from mongoDb
	 * @param {object} parameters - connection parameters: {protocol: string, address: string, port: string, user: string, password: string, dbName: string}.
	 * @returns {Promise} resolved with mongoDb connection object: {connection: object, dbConnection: object}.
	 */
	create: function(parameters) {
		return compose(
      andThen(this.generateIndexes),
      this.getConnectionObject(parameters.dbName),
      this.getConnection,
      this.generateConnectionString,
      this.normalizeParameters
    )(parameters)
	}
}