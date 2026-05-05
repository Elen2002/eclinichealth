const Encore = require('@symfony/webpack-encore');



if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    
    .setOutputPath('public/build/')
    
    .setPublicPath('/build')
    
    
    .copyFiles({
        from: './assets/img/',
        to: 'img/[path][name].[ext]',
    })
    
    .addEntry('app', './assets/app.js')
    .addEntry('map', './assets/map.js')
    .addEntry('backend_app', './assets/backend_app.js')
    .addEntry('contact', './assets/contact.js')

    
    .splitEntryChunks()

    
    
    .enableSingleRuntimeChunk()

    
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())

    
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.38';
    })

    
    .enableSassLoader()

    
    .enableReactPreset()

    .autoProvideVariables({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
    })
    .autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
