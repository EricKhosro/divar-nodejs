const autoBind = require("auto-bind");
const UserModel = require("./user.model");
const createHttpError = require("http-errors");

class AuthService {
  #model;

  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }
}

module.exports = new AuthService();
