module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:9998/api',
				changeOrigin: true,
				pathRewrite: { '^/api': '' },
			},
		},
	},
};
