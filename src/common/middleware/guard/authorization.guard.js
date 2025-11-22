const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const UserModel = require("../../../module/user/user.model");
require("dotenv").config();

async function Authorization(req, res, next) {
  try {
    const accessToken = req?.cookies?.access_token;
    const data = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (!data || !data.id)
      throw new createHttpError.Unauthorized(
        AuthorizationMessages.UnAuthorized
      );
    const user = await UserModel.findById(data.id, {
      _id: 1,
      mobile: 1,
      createdAt: 1,
    }).lean();
    if (!user)
      throw new createHttpError.NotFound(AuthorizationMessages.NotFound);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = Authorization;
