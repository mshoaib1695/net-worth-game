import jwt from "jsonwebtoken";
const PUBLIC_KEY = process.env.PUBLIC_KEY || ""
export default function verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, PUBLIC_KEY, (err: any, decoded: any) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }