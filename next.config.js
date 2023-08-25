const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({});

module.exports = nextConfig;
