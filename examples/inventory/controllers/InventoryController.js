class InventoryController {
  get routes () {
    return [{
      "method": "get",
      "path": "/",
      "callback": (req, resp) => resp.send("Hello World!")
    }];
  }
}

module.exports = InventoryController;
