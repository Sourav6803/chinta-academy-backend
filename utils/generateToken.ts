import jwt, { Secret } from "jsonwebtoken";



export const generateToken = (id: string, role: string) => {
  const secret: Secret = process.env.JWT_SECRET_KEY || "secret";
  return jwt.sign({ id, role }, secret, {
    expiresIn: "7d",
  });
};


