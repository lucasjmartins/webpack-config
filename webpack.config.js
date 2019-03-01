// módulo do nodejs
const path = require('path');

// módulo do nodejs
module.exports = {

    // primeiro módulo a ser carregado na minha aplicação
    entry: './app-src/app.js',

    output: {

        // nome do arquivo que será gerado
        filename: 'bundle.js',

        // caminho onde será gravado o bundle gerado
        path: path.resolve(__dirname, 'dist')
    }
}