import { EventEmitter } from "events";
import { createServer, Server } from "http";
import { ApplicationOptions, CRUDMethods, Middleware, Request, Response } from "./types";
import { Router, TestRouter } from "./Router";
import { MiddlewaresChain } from "./Middlewares";
import requestParser from "./middlewares/requestParser";
import poweredBy from "./middlewares/poweredBy";
import parseJson from "./middlewares/parseJson";

export class Application {
  protected requestEmitter = new EventEmitter(); 
  private server = this.createServer();
  protected middlewaresChain = new MiddlewaresChain();

  constructor ({
    isPoweredBy = true,
    isParseJson = true
  }: ApplicationOptions = {}) {
    if (isPoweredBy) {
      this.use(poweredBy);
    }

    if (isParseJson) {
      this.use(parseJson);
    }

    this.use(requestParser);
  }

  listen(port: number, callback?: () => any): Server {
    this.server.listen(port, callback);
    return this.server;
  }

  close() {
    this.server.close();
    return this.server;
  }

  addRouter(router: Router) {
    router.endpointsPaths.forEach(path => {
      const endpoint = router.endpoints.get(path)!;
      Array.from(endpoint.keys()).forEach(method => {
        const handler = endpoint.get(method)!;
        this.requestEmitter.on(
          this.getRouteMask(path, method as CRUDMethods), 
          (req, res) => handler(req, res)
        )
      })
    })
  }

  use(middleware: Middleware) {
    this.middlewaresChain.add(middleware);
    return this;
  }

  private createServer() {
    return createServer((req: Request, res) => {
      const isHandlerTurn = this.middlewaresChain.run(req, res as Response)
      if (!isHandlerTurn) {
        return;
      }
      
      req.on("end", () => {
        const isEmitted = this.requestEmitter.emit(
          this.getRouteMask(req.url!, req.method as CRUDMethods),
          req, res
        );
  
        if (!isEmitted) {
          res.end("Bad Request!");
        }
      });
    });
  }

  private getRouteMask(path: string, method: CRUDMethods) {
    return `[${path}]:[${method}]`
  }
}

export class TestApplication extends Application {
  constructor() {
    super();
  }

  /** DO NOT USE IT */
  override listen(): Server { return createServer(); }

  testRequest(mask: string): boolean {
    return this.requestEmitter.emit(mask);
  }

  initTestRouterAndEndpoint() {
    const testRouter = new TestRouter();
    testRouter.initTestGetEndpoint();
    this.addRouter(testRouter);
  }
}