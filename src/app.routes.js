const { Router } = require("express");
const { AuthRouter } = require("./module/auth/auth.routes");
const { UserAuth } = require("./module/user/user.routes");
const { CategoryRouter } = require("./module/category/category.routes");
const { OptionRouter } = require("./module/option/option.routes");
const mainRouter = Router();

mainRouter.use("/auth", AuthRouter);
mainRouter.use("/user", UserAuth);
mainRouter.use("/category", CategoryRouter);
mainRouter.use("/option", OptionRouter);

module.exports = mainRouter;
