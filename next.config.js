/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withNextEnv = require('next-env')
const dotenvLoad = require('dotenv-load')
dotenvLoad()
module.exports = withNextEnv()

module.exports = nextConfig
