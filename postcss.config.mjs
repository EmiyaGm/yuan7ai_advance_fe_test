/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-mobile-forever': {
      viewportWidth: 1592,
      maxDisplayWidth: 1592,
      valueBlackList: ['1px'],
    },
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px',
      viewportWidth: 1592,
      unitPrecision: 10,
      propList: ['*', '!max-width', '!max-height', '!min-width'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: ['svg'],
      minPixelValue: 0,
      mediaQuery: false,
      replace: true,
      exclude: [/node_modules/],
      landscape: false,
      landscapeUnit: 'vw',
      landscapeWidth: 568,
    },
  },
};

export default config;
