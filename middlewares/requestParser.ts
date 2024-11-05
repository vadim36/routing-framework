import { Middleware } from "../types";

export default ((req, res, next) => {
  let body = "";
  req.on("data", (chunk) => body += chunk);
  req.on("end", () => {
    if (req.method === "POST" && Boolean(body)) {
      req.body = JSON.parse(body);
    }
  });

  next();
}) as Middleware;