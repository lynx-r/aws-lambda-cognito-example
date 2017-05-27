import nconf = require("nconf");
import path = require("path");

nconf.argv().env().file({
  file: `${__dirname}/config.json`
});

export {nconf}