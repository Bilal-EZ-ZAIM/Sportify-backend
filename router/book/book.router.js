const express = require("express");
const router = express.Router();

const { createItem, getAllItems } = require("../../controller/book.controller");

router.post("/book", createItem);
router.get("/book", getAllItems);

module.exports = router;
