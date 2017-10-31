const webpack = require("webpack");
const webpackConfig = require('./webpack.config').find(item => item.target === 'node');
const path = require('path');
const MFS = require('memory-fs');

module.exports = {
  init(bundleUpdated) {


    console.log('WR__ webpack-server-compiler.js INIT bundleUpdated wtf is it ? ', bundleUpdated)
      /* Huh. Didn't expect that. bundleUpdated is a FUNCTION. ??

       WR__ webpack-server-compiler.js INIT bundleUpdated wtf is it ?  function (bundle) {
       // LESSON 176 ReLoad...
       let needsReload = (myBundleRenderer === undefined) // << Boolean


       console.log('SSR Node bundle built or so we\'re told: ') //, bundle) // << Whoa that's alotta code (MBs of code)
       // LESSON 173
       // let myBundleRenderer = require('vue-server-renderer').createBundleRenderer(bundle)
       myBundleRenderer = require('vue-server-renderer').createBundleRenderer(bundle)

       }
       */

    const compiler = webpack(webpackConfig);
    const mfs = new MFS();
    const outputPath = path.join(webpackConfig.output.path, webpackConfig.output.filename);
    compiler.outputFileSystem = mfs;
    compiler.watch({}, (err, stats) => {
      if (err) {
        throw err;
      }
      console.log(stats.toString({ colors: true }));
      bundleUpdated(mfs.readFileSync(outputPath, 'utf-8'));
    });
  }
};
