const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    createFunction: {
      import: path.resolve(
        __dirname,
        'src/handlers/tasksHandler.ts'
      ),
      filename: 'tasksHandler.js',
    }
    // createFunction: {
    //   import: path.resolve(
    //     __dirname,
    //     'src/handlers/create-list-function/create-list.ts'
    //   ),
    //   filename: 'createFunction/createFunction.js',
    // },
    // getFunction: {
    //   import: path.resolve(
    //     __dirname,
    //     'src/handlers/get-lists-function/get-lists.ts'
    //   ),
    //   filename: 'getFunction/getFunction.js',
    // },
    // removeFunction: {
    //   import: path.resolve(
    //     __dirname,
    //     'src/handlers/remove-list-function/remove-list.ts'
    //   ),
    //   filename: 'removeFunction/removeFunction.js',
    // },
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'template_prod.yml'),
          to: '.',
        },
      ],
    }),
  ],
  // Write the output to the .aws-sam/build folder
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
  },

  // Create source maps
  devtool: 'source-map',

  // Resolve .ts and .js extensions
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.png', '.gif', '.jpg', '.svg'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },

  // Target node
  target: 'node',

  // AWS recommends always including the aws-sdk in your Lambda package but excluding can significantly reduce
  // the size of your deployment package. If you want to always include it then comment out this line. It has
  // been included conditionally because the node10.x docker image used by SAM local doesn't include it.
  externals: process.env.NODE_ENV === 'development' ? [] : ['aws-sdk'],

  // Set the webpack mode
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',

  // Add the TypeScript loader
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },
};
