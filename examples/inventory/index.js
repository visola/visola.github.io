const Application = require("./Application");
const controllers = require("./controllers");
const LOGGER = require("./logger");

let app = new Application(8080);
app.start();

for (let controllerName in controllers) {
  let controller = controllers[controllerName];
  if (typeof controller.routes == "undefined" || controller.routes.length === 0) {
    throw new Error(`Controller ${controllerName} has no routes defined.`);
  }

  for (let route of controller.routes) {
    let {method, path} = route;
    LOGGER.debug(`Registering route: ${method.toUpperCase()} ${path} -> ${controllerName}`);
    app.registerRoute(route);
  }
}
