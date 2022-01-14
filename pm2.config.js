module.exports = {
  apps : [{
    name: 'shopify_server',
    script: 'server.mjs',
    env: {
      'NODE_ENV': 'production',
    }
  }],
}