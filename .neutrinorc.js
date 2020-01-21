module.exports = {
  use: [
    ['@neutrinojs/dev-server', {
      publicPath: '/',
      headers: {
        stats: {
          publicPath: true,
        },
      },
    }],
    ['@neutrinojs/airbnb', {
      eslint: {
        rules: {
          "linebreak-style": ["error", "windows"],
          "indent": ["error", 4, { "SwitchCase": 1 }],
          "react/jsx-indent": ["error", 4],
          "react/jsx-indent-props": ["error", 4],
          "react/prop-types": 0,
          "react/no-multi-comp": 0,
          "no-console": "off",
          "camelcase": 0,
          "max-len": 0,
          "jsx-a11y/mouse-events-have-key-events": 0,
          "jsx-a11y/label-has-for": { "some": [ "nesting", "id" ] },
          "jsx-a11y/anchor-is-valid": 0,
          "react/no-array-index-key": 0,
          "prefer-destructuring": ["error", {"object": false, "array": true}],
        }
      }
    }],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Zephyrus | SC2 Replay Analysis'
        },
      }
    ],
    (neutrino) => {
      neutrino.config.module
        .rule('postcss')
          .test(/\.css$/)
          .use('postcss')
            .loader('postcss-loader');
    },
  ]
};