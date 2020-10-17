const fs = require('fs');

const metadata = require('./metadata.json');

fs.writeFileSync("api-url.txt", metadata.SimpleLambdaStack.ApiURL);