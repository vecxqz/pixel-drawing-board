module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: 'http://localhost:3003',
        pathRewrite: {
          "/api": ""
        }
      }
    }
  }
}