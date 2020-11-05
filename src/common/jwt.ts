import jwt from 'jsonwebtoken';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        export interface Request {
            userID?: string;
        }
    }
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const authenticateToken = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401); // if there isn't any token
    }
    const data = jwt.decode(token);
    if (!data || !data.userId) {
        return res.sendStatus(403);
    }
    req.userID = data.userId;
    next();
};

export default authenticateToken;
