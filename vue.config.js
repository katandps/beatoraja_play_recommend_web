module.exports = {
  publicPath: "./",
  outputDir: "docs",

  devServer: {
    allowedHosts: ["localhost.katand.net"],
    server: "https"
  },
  transpileDependencies: true
}
