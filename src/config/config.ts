import nconf = require("nconf");
import path = require("path");

nconf.argv().env().file({
  file: path.resolve(__dirname, "../../config.json")
});

export {nconf}