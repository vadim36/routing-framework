import { CRUDMethods, Endpoint, Handler } from "./types"

export class Router {
  endpoints = new Map<string, Endpoint>();
  
  request(path: string, handler: Handler, method = CRUDMethods.GET) {
    if (!this.endpoints.has(path)) {
      this.endpoints.set(path, EndpointFactory.addEnpoint())
    }

    const endpoint = this.endpoints.get(path)!
    if (endpoint.get(method)) {
      throw new Error(`Method ${method} already defined for path ${path}`);
    }

    endpoint.set(method, handler);
  }

  get(path: string, handler: Handler) {
    return this.request(path, handler)
  }

  post(path: string, handler: Handler) {
    return this.request(path, handler, CRUDMethods.POST)
  }

  put(path: string, handler: Handler) {
    return this.request(path, handler, CRUDMethods.PUT)
  }

  delete(path: string, handler: Handler) {
    return this.request(path, handler, CRUDMethods.DELETE)
  }


  get endpointsPaths(): string[] {
    return Array.from(this.endpoints.keys());
  }
}

class EndpointFactory {
  static addEnpoint(): Endpoint {
    return new Map<string, Handler>();
  }
}

export class TestRouter extends Router {
  constructor () {
    super();
  }

  initTestGetEndpoint() {
    this.get("/", () => 0);
  }
}