const EXEC  = require('child_process').exec,
      MODEL = require('./src/model/data.json'),
      PATH  = 'node_modules/casperjs/bin/casperjs src/script.js';

main();

function main() {
  let param = JSON.stringify(MODEL),
      cmd   = `${PATH} '${param}'`;

  try       { EXEC(cmd, execCallback); }
  catch (e) { console.error(e);        }
}

function execCallback(err, stdout, stderr) {
  return console.log(stdout);
}
