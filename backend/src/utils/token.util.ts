import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config/app.config";

interface TokenPayload {
  userId: string;
}

/**
 * Verify JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (
  token: string
): { payload: TokenPayload | null; expired: boolean } => {
  try {
    const secret = config.jwt.secret;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return { payload: decoded, expired: false };
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      const decoded = jwt.decode(token) as TokenPayload;
      return { payload: decoded, expired: true };
    }
    return { payload: null, expired: false }; // Other errors (invalid token)
  }
};

/**
 * Extract token from authorization header
 * @param authHeader Authorization header string
 * @returns Token string or null if not found
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1].trim();
};

/**
 * @param userId - User ID to generate tokens for
 * @returns { accessToken: string, refreshToken: string } - Generated access and refresh tokens
 * @description Generates access and refresh tokens for the user.
 */
export function generateTokens(userId: string | Types.ObjectId): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken };
}

/**
 * Generates a refresh token for the user.
 * @param userId - User ID to generate refresh token for
 * @returns {string} - Generated refresh token
 */
export function generateRefreshToken(userId: string | Types.ObjectId): string {
  const jwtSecret = config.jwt.secret;
  const refreshTokenExpiry = Number(config.jwt.refreshTokenExpiry);

  return jwt.sign({ userId }, jwtSecret, { expiresIn: refreshTokenExpiry });
}

/**
 * Generate a access token for the user.
 * @param userId - User ID to generate access token for
 * @returns {string} - Generated access token
 */
export function generateAccessToken(userId: string | Types.ObjectId): string {
  const jwtSecret = config.jwt.secret;
  const accessTokenExpiry = Number(config.jwt.accessTokenExpiry);

  return jwt.sign({ userId }, jwtSecret, { expiresIn: accessTokenExpiry });
}
