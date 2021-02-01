module.exports = {
    mode: 'production', // production|development
    externals: {
        'lodash': {
            commonjs: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    }
}