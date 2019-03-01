// módulo do nodejs
const path = require('path');

// plugin para realizar o uglify do bundle
const babiliPlugin = require('babili-webpack-plugin');

// plugin para extrair os conteúdos css em um arquivo separado
const extractTextPlugin = require('extract-text-webpack-plugin');

// plugin para remover os imports de css e js do index.html
const htmlWebpackPlugin = require('html-webpack-plugin');

// webpack
const webpack = require ('webpack');

// array de plugins
let plugins = [];

plugins.push(new htmlWebpackPlugin({

    // adiciona um hash ao final dos arquivos css e js para invalidar o cache
    hash: true,

    // configurações para minificar
    minify: {
        html5: true,
        
        // remove os espaços entre as tags
        collapseWhiteSpace: true,

        // remove os comentários
        removeComments: true
    },

    // nome do arquivo que será gerado
    filename: 'index.html',

    // template que será utilizado para gerar o arquivo index.html
    template: __dirname + '/main.html'
}))

// recebe como parâmetro o nome do arquivo que será gerado
plugins.push(new extractTextPlugin('styles.css'))

// Sepação do nosso código das bibliotecas 
plugins.push(new webpack.optimize.CommonsChunkPlugin({
    
    // identificador
    name: 'vendor',

    // bundle onde as bibliotecas ficarão
    filename: 'vendor.bundle.js',
}));

// api de desenvolvimento
let SERVICE_URL = JSON.stringify('http://api-develop.com');

// process é a variável que dá acesso ao processo do nodejs
if (process.env.NODE_ENV == 'production') {

    // api de produção
    SERVICE_URL = JSON.stringify('http://api-producao.com');

    // otmização para a geração do bundle
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

    // uglify
    plugins.push(new babiliPlugin());

    // adicionando as variáveis '$' e 'jQuery' para serem acessadas por todos os módulos da aplicação
    plugins.push(new webpack.ProvidePlugin({
        '$': 'jquery/dist/jquery.js',
        'jQuery': 'jquery/dist/jquery.js'
    }))
}

// plugin para alterar o endereço da api de acordo com o ambiente
plugins.push(new webpack.DefinePlugin({
    
    // recebe como parâmetro o nome da váriavel que será procurada na aplicação e o valor que será atribuído
    API_URL: SERVICE_URL
}));

// módulo do nodejs
module.exports = {

    // primeiro módulo a ser carregado na minha aplicação
    entry: {
        
        // módulo de entrada da aplição, a partir desse arquivo o webpack criará o arquivo bundle.js
        app: './app-src/app.js',

        // identificador declarado na configuração do CommonsChunkPlugin
        // bibliotecas que serão adicionadas no arquivo vendor.bundle.js
        vendor: ['jquery', 'bootstrap']
    },

    output: {

        // nome do arquivo que será gerado
        filename: 'bundle.js',

        // caminho onde será gravado o bundle gerado
        path: path.resolve(__dirname, 'dist'),

        // configuração para que o webpack-dev-server crie o bundle em memória, porém na path dist 
        publicPath: 'dist'
    },

    module: {

        // regras que serão aplicadas no módulo antes da geração do bundle
        rules: [
            {
                // através de uma expressão regular, indicamos que para cada arquivo com a extensão .js o loader será aplicado
                test: /\.js$/,

                // arquivos que não quero que a regra seja aplicadas
                exclude: /node_modules/,
                
                // loader que será executado, nesse caso, a transpilação do typescript
                use: {
                    loader: 'babel-loader'
                }
            }, 

            {
                // indicamos que para cada arquivo com a extensão .css o loader será aplicado
                test: /\.css$/,
                use: extractTextPlugin({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })

                // css-loader tranformará o arquivo css em um objeto javascript (json)
                // style-loader pegará esse objeto js (json) e tranformará o css em line para colocar no html
                // o sinal ! representa que será executado um loader em seguida o outro. Sendo a execução da direita para a esquerda
                // loader: 'style-loader!css-loader'
            },

            // regras para tratar as fontes do Bootstrap
            { 
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader' 
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
            }
        ]
    },

    // plugins que serão executados após a geração do bundle
    plugins
}