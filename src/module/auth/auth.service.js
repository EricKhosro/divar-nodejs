const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");
const { randomInt } = require("crypto");
const createHttpError = require("http-errors");
const { AuthMessages } = require("./auth.message");
const jwt = require("jsonwebtoken");

class AuthService {
  #model;

  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }

  async sendOTP(mobile) {
    const code = randomInt(10000, 99999);
    const now = Date.now();
    const expiresIn = now + 1000 * 60 * 2; // add 2 mins
    const otp = {
      code,
      expiresIn,
    };
    const user = await this.#model.findOne({ mobile });
    if (!user) {
      return await this.#model.create({
        mobile,
        otp,
      });
    }

    if (user.otp && user.otp.expiresIn > now)
      throw new createHttpError.BadRequest(AuthMessages.otpCodeNotExpired);

    user.otp = otp;
    await user.save();
    return user;
  }
  async checkOTP(mobile, code) {
    const user = await this.checkExistByMobile(mobile);
    const now = Date.now();
    if (!user.otp || now > user.otp.expiresIn)
      throw new createHttpError.Unauthorized(AuthMessages.otpCodeExpired);

    if (user.otp && user.otp.code !== code)
      throw new createHttpError.Unauthorized(AuthMessages.invalidOTP);

    if (!user.verifiedMobile) {
      user.verifiedMobile = true;
      await user.save();
    }

    return this.signToken({ mobile, id: user._id });
  }

  async checkExistByMobile(mobile) {
    const user = await this.#model.findOne({ mobile });
    if (!user) throw new createHttpError.NotFound(AuthMessages.notFound);
    return user;
  }

  signToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: 1000 * 60 * 60 * 24 * 365,
    });
  }
}

module.exports = new AuthService();
