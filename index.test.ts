import { Application, TestApplication } from "./Application";
import { TestMiddlewareChain } from "./Middlewares";
import { TestRouter } from "./Router";

describe("routing handler", () => {
  it("the router object containts endpoints", () => {
    const router = new TestRouter();
    router.initTestGetEndpoint();

    const isEndpointHas = router.endpoints.has("/");
    expect(isEndpointHas).toBeTruthy();
  })

  it("init and listen server", () => {
    const app = new Application().listen(0, () => app.close());
  })

  it("add router add handler emitted", () => {
    const app = new TestApplication();
    app.initTestRouterAndEndpoint();

    const isEmitted = app.testRequest("[/]:[GET]");
    expect(isEmitted).toBeTruthy();
  })
});

describe("middlewares", () => {
  it("add middleware and run handler", () => {
    const middlewareChain = new TestMiddlewareChain();
    const middleware = jest.fn((req, res, next) => next());

    middlewareChain.add(middleware);
    const willHandlerRun = middlewareChain.runTestChain();

    expect(middleware).toHaveBeenCalled();
    expect(willHandlerRun).toBeTruthy();
  })
  
  it("intercept handler", () => {
    const middlewareChain = new TestMiddlewareChain()
    const middleware = jest.fn(() => 0);
    
    middlewareChain.add(middleware);
    const willHandlerRun = middlewareChain.runTestChain();

    expect(middleware).toHaveBeenCalled();
    expect(willHandlerRun).toBeFalsy();
  })

  it("several middlewares", () => {
    const middlewareChain = new TestMiddlewareChain()
    const middleware1 = jest.fn((req, res, next) => next());
    const middleware2 = jest.fn((req, res, next) => next());

    middlewareChain.add(middleware1);
    middlewareChain.add(middleware2);
    const willHandlerRun = middlewareChain.runTestChain();

    expect(middleware1).toHaveBeenCalled();
    expect(middleware2).toHaveBeenCalled();
    expect(willHandlerRun).toBeTruthy();
  })
  
  it("middleware redirect", () => {
    const middlewareChain = new TestMiddlewareChain()
    const middleware = jest.fn((req, res, next) => next("/new-path"));
  
    middlewareChain.add(middleware);
    const willHandlerRun = middlewareChain.runTestChain();

    expect(middleware).toHaveBeenCalled();
    expect(willHandlerRun).toBeFalsy();
  })
})