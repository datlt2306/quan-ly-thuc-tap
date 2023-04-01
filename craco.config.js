module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'https://hungthinhland.org.vn',
				changeOrigin: true,
				pathRewrite: { '^/api': '' },
			},
		},
	},
};
