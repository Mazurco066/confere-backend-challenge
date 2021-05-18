/**
 * Freezes all object fields
 * @param {*} obj 
 * @returns 
 */
const immutable = (obj) => {
	Object.keys(obj).forEach(function freezeObjects(name) {
		const value = obj[name]
		if (typeof value === "object" && value != null) {
			immutable(value)
		}
	})
	return Object.freeze(obj)
}

// Exporting
module.exports = immutable