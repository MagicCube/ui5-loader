#FORE MORE INFORMATION, PLEASE VISIT [babel-plugin-ui5](https://github.com/MagicCube/babel-plugin-ui5)






# ui5-loader
An UNOFFICIAL experimental Webpack loader for SAP UI5. Together with my Babel
plugin(https://github.com/MagicCube/babel-plugin-ui5), you are abel to use
Webpack + Babel to build your next generation UI5 applications.

## Usage
### 1. Install babel-preset-ui5
Please refer to [babel-preset-ui5](https://github.com/MagicCube/babel-preset-ui5).

### 2. Install ui5-loader
```sh
$ npm install --save-dev ui5-loader
```

### 3. Configure webpack.config.js
```javascript
{
    ...
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    "ui5-loader?sourceRoot=./src",
                    "babel-loader?sourceRoot=./src"
                ]
            }
        ]
    }
}
```
