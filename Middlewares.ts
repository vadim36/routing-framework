import { IncomingMessage, ServerResponse } from "http";
import { Middleware, Request, Response } from "./types";
import { Socket } from "net";

export class MiddlewaresChain {
  private middlewares: Middleware[] = [];

  add(middleware: Middleware) {
    this.middlewares.unshift(middleware);
  }

  run(req: Request, res: Response): boolean {
    let currentState = 0;
    const next = (path?: string) => {
      if (path && req.url !== path) {
        res.writeHead(302, { "Location": path });
        return res.end();
      }

      currentState++;
    }

    let isHandlerTurn = true;
    let latestState = -1;
    while (currentState < this.middlewares.length) {
      if (latestState === currentState) {
        isHandlerTurn = false;
        break;
      }

      latestState = currentState;
      this.middlewares[currentState](req, res, next);
    }

    return isHandlerTurn;
  }
}

export class TestMiddlewareChain extends MiddlewaresChain {
  constructor() {
    super();
  }

  runTestChain() {
    const req = new IncomingMessage(new Socket);
    return this.run(req, new ServerResponse(req));
  }
}