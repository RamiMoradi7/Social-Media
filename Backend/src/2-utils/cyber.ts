import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";
import { IUser } from "../4-models/user";
import { RoleModel } from "../4-models/enums";

class Cyber {
  public getNewToken(user: IUser): string {
    // Remove password from user:
    delete user.password;
    const { _id, firstName, lastName, email, roleId } = user;

    // Create container object containing the user:
    const container = { user: { _id, firstName, lastName, email, roleId } };

    // Create options:
    const options: SignOptions = { expiresIn: "3h" };

    // Create token:
    const token = jwt.sign(container, appConfig.jwtSecretKey, options);
    // Return:
    return token;
  }

  // Check if token is valid:
  public isTokenValid(token: string): boolean {
    try {
      // If no token:
      if (!token) return false;

      // Verify token:
      jwt.verify(token, appConfig.jwtSecretKey);

      // All is good:
      return true;
    } catch (err: any) {
      // Token is not valid.
      return false;
    }
  }

  // Check if user is admin:
  public isAdmin(token: string): boolean {
    // Extract container from token:
    const container = jwt.decode(token) as { user: IUser };

    // Extract user from container:
    const user = container.user;

    // Return true if user is Admin:
    return user.roleId === RoleModel.Admin;
  }

  // Hash password:
  public hashPassword(plainText: string): string {
    // SHA = Secured Hashing Algorithm.
    // HMAC = Hash-Based Message Authentication Code
    const hashedPassword = crypto
      .createHmac("sha512", appConfig.passwordSalt)
      .update(plainText)
      .digest("hex");

    // Return:
    return hashedPassword;
  }
}

export const cyber = new Cyber();
