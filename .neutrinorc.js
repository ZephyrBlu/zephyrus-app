const react = require('@neutrinojs/react');
const airbnb = require('@neutrinojs/airbnb');

module.exports = {
  options: {
    root: __dirname,
    output: 'build',
  },
  use: [
    // ['@neutrinojs/dev-server', {
    //   publicPath: '/',
    //   headers: {
    //     stats: {
    //       publicPath: true,
    //     },
    //   },
    // }],
    airbnb({
      eslint: {
        rules: {
          "linebreak-style": ["error", "windows"],
          "indent": ["error", 4, { "SwitchCase": 1 }],
          "react/destructuring-assignment": 0,
          "react/react-in-jsx-scope": 0,
          "react/jsx-wrap-multilines": 0,
          "react/jsx-one-expression-per-line": 0,
          "react/jsx-indent": ["error", 4],
          "react/jsx-indent-props": ["error", 4],
          "react/prop-types": 0,
          "react/no-multi-comp": 0,
          "react-hooks/exhaustive-deps": 0,
          "react/button-has-type": 0,
          "react/jsx-fragments": 0,
          "no-console": "off",
          "camelcase": 0,
          "max-len": 0,
          "operator-linebreak": 0,
          "jsx-a11y/mouse-events-have-key-events": 0,
          "jsx-a11y/label-has-for": 0,
          "jsx-a11y/anchor-is-valid": 0,
          "react/no-array-index-key": 0,
          "prefer-destructuring": ["error", {"object": false, "array": true}],
          "no-unused-expressions": ["error", { "allowTernary": true }],
          "no-param-reassign": ["error", { "props": false }],
          "arrow-parens": [2, "as-needed", { "requireForBlockBody": true }],
        }
      }
    }),
    react({
      html: {
        title: 'Zephyrus | SC2 Replay Analysis',
        template: 'src/template.ejs',
      },
    }),
    (neutrino) => {
      neutrino.config
        .module
          .rule('postcss')
            .test(/\.css$/)
            .use('postcss')
              .loader('postcss-loader');
    },
  ]
};