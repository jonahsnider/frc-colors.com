/**
 * @returns {string}
 */
function getBaseApiUrl() {
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}

	if (process.env.API_URL) {
		return process.env.API_URL;
	}

	throw new TypeError('NEXT_PUBLIC_API_URL or API_URL is not defined');
}

module.exports = getBaseApiUrl;
