const router = require("express").Router();
const indexController = require("../controller/index.controller");

router.get("/", indexController.index);

router.post("/", indexController.create);

router.get("/:shortId", indexController.show);

module.exports = router;
