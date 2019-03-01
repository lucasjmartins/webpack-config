# webpack-config

## Configuração do webpack + babel

- UglifyJs não suporta a sintaxe do es2015 em diante

## Variáveis de ambiente nodejs

Para garantir que as variáveis de ambiente do nodejs funcionem em qualquer plataforma (Windows, MacOs, Linux...) instalar a library:

```
npm i cross-env@5.0.1 -D
```

```
// package.json
"scripts": {
    "build-prod": "cross-env NODE_ENV=production"
}
```

## Importando Bootstrap como um módulo

Ao realizarmos esse tipo de import (sem './' ou '../'), o webpack entende que ele deverá buscar o arquivo dentro da pasta node_modules.

```
// app.js
import 'bootstrap/dist/css/bootstrap.css';
```

O webpack não entende arquivos css como módulos, portanto, precisaremos instalar novos loaders:

```
npm i css-loader@0.28.4 style-loader@0.18.2 -D
```

Loaders para tratar as fontes do Bootstrap:

```
npm i url-loader@0.5.9 file-loader@0.11.2 -D
```

## Importando um css qualquer

```
// app.js
import '../css/style.css';
```

## FOUC (Flash of Unstyled Content)

O webpack adicionou todos os arquivos css e js no mesmo bundle.js e via javascript está adicionando na tag <style> os conteúdos css.

Para gerarmos um arquivo css separado do js precisaremos do plugin extract-text-webpack-plugin.

```
npm i extract-text-webpack-plugin@3.0.0 -D
```

## Importando scripts

```
import 'bootstrap/js/modal.js'
```

Problema: o jquery não está no escopo para os módulos da aplição, sendo assim a modal retorna erro: jQuery is not defined.

Para isso utilizaremos o webpack.ProvidePlugin.

## Removendo os imports de css e js do index.html

```
npm i html-webpack-plugin@2.29.0 -D
```

Esse plugin gera um html (através de um html template) importando todos os arquivos que foram gerados após o build e adiciona na dist.

## Code splitting e Lazy loading

```
const { LazyService } = await System.import('../services/LazyService);
const service = new LazyService();
```

## Alterando o endereço da API no build de produção

Através do plugin webpack.DefinePlugin você define o nome da variável que será procurada em todos os módulos da aplicação e ele fará a substituição do valor que foi atribuido a essa variável.

```
this.http.get(`${API_URL}/negociações/semana`)
```