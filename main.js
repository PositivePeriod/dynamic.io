const path = require('path');
const express = require('express');

const router = express();

router.use('/', express.static(path.join(__dirname, '/v1')));

var port = process.env.PORT || 8000;
router.listen(port, function() {
    console.log(`dynamic.io listening on port ${port}!`);
});