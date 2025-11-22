const autoBind = require("auto-bind");
const authService = require("./auth.service");
const { AuthMessages } = require("./auth.message");
const NodeEnv = require("../../common/constants/env.enum");
const CookieName = require("../../common/constants/cookie.enum");

class AuthController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = authService;
  }

  async sendOTP(req, res, next) {
    try {
      const { mobile } = req.body;
      console.log({ mobile });
      await this.#service.sendOTP(mobile);
      return res.status(200).json({
        message: AuthMessages.sendOtpSuccessfully,
      });
    } catch (error) {
      next(error);
    }
  }
  async checkOTP(req, res, next) {
    try {
      const { mobile, code } = req.body;
      const accessToken = await this.#service.checkOTP(mobile, code);
      return res
        .cookie(CookieName.AccessToken, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === NodeEnv.Development,
        })
        .status(200)
        .json({
          message: AuthMessages.successfulLogin,
        });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res
        .clearCookie(CookieName.AccessToken)
        .status(200)
        .json({ message: AuthMessages.logout });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
