const express = require('express');

const app = express();

const port = process.env.PORT || 8491;

app.listen(port, () => {
  console.log(`api listening on port ${port}`);
});
