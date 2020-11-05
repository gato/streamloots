import { Request, Response, NextFunction } from 'express';

// Error handler to display the error as HTML
export default function errorHandler(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    err,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void {
    res.status(err.status || 500);
    res.send(
        `<h1>${err.status || 500} Error</h1>` + `<pre>${err.message}</pre>`
    );
}
