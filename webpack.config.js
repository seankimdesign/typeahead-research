const webpack = require('webpack')
const path = require('path')
const BabiliPlugin = require("babili-webpack-plugin")
const distPath = path.resolve(__dirname, 'dist')


const isProductionReady = false


let plugins = [
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery"
	})
]
if (isProductionReady) plugins = [...plugins, new BabiliPlugin()]

module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: distPath
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'url-loader',
				options: {
					limit: 50000,
					mimetype: 'application/font-woff',
					name: './fonts/[hash].[ext]',
					publicPath: './dist/',
				},
			},
			{
				test: /\.png$/,
				loader: 'file-loader',
				options: {
					publicPath: './dist/',
				}
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
		]
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 500,
		poll: 1500
	}
}