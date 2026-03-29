var express = require("express");
var router = express.Router();
var lightFunctions = require("../lightFunctions");

/* GET users listing. */
router.get("/getLights", function (req, res, next) {
  let a = lightFunctions.getLights();

  a.then((b) => {
    console.log(b);
    res.set("Cache-Control", "private, max-age=60");
    res.setHeader("content-type", "application/json");
    res.send(b);
  });
});

router.put("/control", function (req, res) {
  const { device, model, on } = req.body || {};
  if (
    typeof device !== "string" ||
    device.length === 0 ||
    typeof model !== "string" ||
    model.length === 0 ||
    typeof on !== "boolean"
  ) {
    res.status(400).json({
      ok: false,
      error: "Expected JSON body: { device, model, on } (on must be boolean).",
    });
    return;
  }
  lightFunctions.setLightPower({ device, model, on }).then((result) => {
    res.setHeader("content-type", "application/json");
    if (result.ok) {
      res.json({ ok: true, data: result.json });
    } else {
      res.status(result.status >= 400 ? result.status : 502).json({
        ok: false,
        data: result.json,
      });
    }
  });
});

module.exports = router;
