import { IncomingMessage, ServerResponse } from "http"

export enum CRUDMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

export type Request = IncomingMessage & { body?: string };
export type Response = ServerResponse & { send?: (data: any) => void };
export type Handler = (req: Request, res: Response) => void;
export type Endpoint = Map<string, Handler>;
export type Middleware = (req: Request, res: Response, next: Function) => any;

export type ApplicationOptions = Partial<{
  isPoweredBy: boolean;
  isParseJson: boolean;
}>