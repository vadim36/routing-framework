import { Middleware } from "../types";

export default ((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.send = (data: any) => {
    res.end(JSON.stringify(data));
  }
  next();
}) as Middleware;