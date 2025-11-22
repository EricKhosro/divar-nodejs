const autoBind = require("auto-bind");
const userService = require("./user.service");

class AuthController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = userService;
  }

  whoami(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
