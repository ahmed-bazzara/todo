const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// const AwsSamPlugin = require('aws-sam-webpack-plugin');

// const awsSamPlugin = new AwsSamPlugin({
//   projects: {
//     createList: './src/handlers/create-list-function',
//     getLists: './src/handlers/get-lists-function',
//   },
//   vscodeDebug: true,
// });

module.exports = {
  // Loads the entry object from the AWS::Serverless::Function resources in your
  // SAM config. Setting this to a function will
  // entry: () => awsSamPlugin.entry(),

  entry: {
    awsSdk: { import: 'aws-sdk', runtime: 'runtime' },
    createFunction: {
      import: path.resolve(
        __dirname,
        'src/handlers/create-list-function/create-list.ts'
      ),
      filename: 'createFunction/createFunction.js',
      dependOn: ['awsSdk'],
    },
    getFunction: {
      import: path.resolve(
        __dirname,
        'src/handlers/get-lists-function/get-lists.ts'
      ),
      filename: 'getFunction/getFunction.js',
      dependOn: ['awsSdk'],
    },
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(
            __dirname,
            'src/handlers/create-list-function/template.yml'
          ),
          to: 'createFunction',
        },
        {
          from: path.resolve(
            __dirname,
            'src/handlers/get-lists-function/template.yml'
          ),
          to: 'getFunction',
        },
      ],
    }),
  ],
  // Write the output to the .aws-sam/build folder
  // output: {
  //   filename: (chunkData) => awsSamPlugin.filename(chunkData),
  //   libraryTarget: 'commonjs2',
  //   path: path.resolve(__dirname, 'dist'),
  // },

  // Create source maps
  devtool: 'source-map',

  // Resolve .ts and .js extensions
  resolve: {
    extensions: ['.ts', '.js'],
  },

  // Target node
  target: 'node',

  // AWS recommends always including the aws-sdk in your Lambda package but excluding can significantly reduce
  // the size of your deployment package. If you want to always include it then comment out this line. It has
  // been included conditionally because the node10.x docker image used by SAM local doesn't include it.
  externals: process.env.NODE_ENV === 'development' ? [] : ['aws-sdk'],

  // Set the webpack mode
  mode: 'production',

  // Add the TypeScript loader
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },

  // Add the AWS SAM Webpack plugin
  // plugins: [awsSamPlugin],
};
