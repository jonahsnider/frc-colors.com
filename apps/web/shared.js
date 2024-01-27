/**
 * @returns {string}
 */
function getBaseApiUrl() {
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return 'http://localhost:3001';
}

module.exports = getBaseApiUrl;
