module.exports = {
    plugins: [
        '@babel/plugin-proposal-optional-chaining', // Organic Start
        '@babel/plugin-syntax-dynamic-import', // add support for dynamic imports (used in app.js)
        'lodash', // Tree-shake lodash
    ],
    presets: [
        ['@babel/preset-env', {
            //debug: true,
            loose: true, // Enable "loose" transformations for any plugins in this preset that allow them
            modules: 'auto',
            useBuiltIns: 'usage', // Tree-shake babel-polyfill
            targets: {
                node: 'current',
            },
        }],
    ],
};