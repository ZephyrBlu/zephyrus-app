module.exports = {
  use: [
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
          "max-len": 0,
          "jsx-a11y/mouse-events-have-key-events": 0,
          "jsx-a11y/label-has-for": { "some": [ "nesting", "id" ] },
        }
      }
    }],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Zephyrus | SC2 Replay Analysis'
        }
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