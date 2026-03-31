var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next){
    res.status(200);
    res.send();
})

router.get('/tokens', function (req, res, next) {
    const oauth2Client = req.app.get("oauth2Client");
    const credentials = oauth2Client?.credentials || {};

    res.status(200).json({
        hasAccessToken: Boolean(credentials.access_token),
        hasRefreshToken: Boolean(credentials.refresh_token),
    });
});

module.exports = router;