import express from 'express';
import Logger from 'bunyan';
export declare const logRequest: ({ logger }: any) => express.RequestHandler<import("express-serve-static-core").ParamsDictionary>;
export interface Request extends express.Request {
    id?: string | number | string[];
    log?: Logger;
}
export interface Response extends express.Response {
    duration?: string;
    log?: Logger;
}
export interface NextFunction extends express.NextFunction {
}
