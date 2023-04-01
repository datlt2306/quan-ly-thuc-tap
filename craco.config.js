module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'https://hungthinhland.org.vn/api',
				changeOrigin: true,
				pathRewrite: { '^/api': '' },
			},
		},
	},
};
