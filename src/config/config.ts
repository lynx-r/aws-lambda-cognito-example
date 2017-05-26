import nconf = require("nconf");
import path = require("path");

nconf.argv().env().file({
  file: 'config.json'
});

export {nconf}