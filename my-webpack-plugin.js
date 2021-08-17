class MyWebpackPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('My Plugin', stats => {
            console.log('My Plugin: done');
            console.log(compiler);
        })

        compiler.hooks.emit.tapAsync('MyWebpackPlugin', (compilation, callback) => {
            const source = compilation.assets['main.js'].source();
            compilation.assets['main.js'].source = () => {
                const banner = [
                    '/**',
                    ' * 이것은 BannerPlugin이 처리한 결과입니다.',
                    ' * Build Date: 2021-08-16',
                    ' */'
                ].join('\n');
                return banner + '\n\n' + source;
            }

            callback();
        })

    }
}

module.exports = MyWebpackPlugin;
