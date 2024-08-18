import { cyber } from "../2-utils/cyber";
import { ValidationError } from "../4-models/client-errors";
import { ICredentials } from "../4-models/credentials";
import { RoleModel } from "../4-models/enums";
import { IUser, User } from "../4-models/user";

class AuthService {
  public async register(user: IUser): Promise<string> {
    const errors = user.validateSync();
    if (errors) throw new ValidationError(errors.message);
    const isTaken = await this.isEmailTaken(user.email);
    if (isTaken) throw new ValidationError("Email is already taken.");
    user.email = user.email.toLowerCase();
    user.password = cyber.hashPassword(user.password);
    user.roleId = RoleModel.User;
    const addedUser = await user.save();
    user.id = addedUser._id;
    const token = cyber.getNewToken(user);
    return token;
  }

  public async login(credentials: ICredentials): Promise<string> {
    credentials.validateSync();
    credentials.password = cyber.hashPassword(credentials.password);
    const user = await User.findOne({
      email: credentials.email.toLowerCase(),
      password: credentials.password,
    }).exec();
    if (!user) {
      throw new ValidationError("Incorrect email or password.");
    }
    user.isActive = true;
    user.lastLogin = new Date();
    await user.save();
    const token = cyber.getNewToken(user);
    return token;
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser) {
      return false;
    }
    return true;
  }
}

export const authService = new AuthService();
