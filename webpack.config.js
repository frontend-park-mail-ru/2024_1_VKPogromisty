const path = require('path');

module.exports = {
  entry: {
    index: './public/index.js',
    login: './public/components/Login/loginForm.precompiled.js',
    feed: './public/components/Feed/feedMain.precompiled.js',
    signup: './public/components/Signup/signup.precompiled.js',
    profile: './public/components/Profile/profileMain.precompiled.js',
    header: './public/components/Header/header.precompiled.js',
    messenger: './public/components/Messenger/messengerMain.precompiled.js',
    chat: './public/components/Chat/chatMain.precompiled.js',
    friends: './public/components/Friends/friendsMain.precompiled.js',
    main: './public/components/Main/main.precompiled.js',
    message: './public/components/Chat/message.precompiled.js',
    settings: './public/components/Settings/settingsMain.precompiled.js',
    post: './public/components/Post/post.precompiled.js',
    messengerMessage: './public/components/Messenger/messenge.precompiled.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
    ],
  },
};