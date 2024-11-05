import { Middleware } from "../types";

export default ((req, res, next) => {
  res.setHeader("X-Powered-By", "BackFramework")
  next();
}) as Middleware;