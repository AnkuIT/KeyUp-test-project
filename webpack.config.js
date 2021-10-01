const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin")

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all',
		}
	}

	if (isProd) {
		config.minimizer = [
			new CssMinimizerPlugin(),
			new TerserWebpackPlugin(),
		]
	}
	return config;
}

const cssLoaders = (prepros) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,

		},
		'css-loader',
	];

	if (prepros) {
		loaders.push(prepros);
	}
	return loaders;
}

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].bundle.${ext}`);

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: './js/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: filename('js'),
	},
	resolve: {
		extensions: ['.js', '.json', '.css', '.scss'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	optimization: optimization(),
	devServer: {
		port: 3000,
		open: true,
		hot: isDev,

	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './part_1.html',
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new HtmlWebpackPlugin({
			filename: 'template_2.html',
			template: './part_2.html',

			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets/favicon.ico'),
					to: path.resolve(__dirname, 'dist'),
				},
				// {
				// 	from: path.resolve(__dirname, 'src/assets/img'),
				// 	to: path.resolve(__dirname, 'dist'),
				// }
			]

		}),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),

	],
	module: {
		rules: [
			//loading CSS
			{
				test: /\.css$/,
				use: cssLoaders(),
			},
			//loading SASS/SCSS
			{
				test: /\.s[ac]ss$/i,
				use: cssLoaders('sass-loader'),
			},
			//loading <img>
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				use: ['file-loader',],
			},
			//loading fonts
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				use: ['file-loader'],
			},
		],
	},
}