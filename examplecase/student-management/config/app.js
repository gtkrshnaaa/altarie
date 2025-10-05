// Application config for altarie.js
export default {
  name: 'altarie.js',
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.APP_PORT || 3000)
}
