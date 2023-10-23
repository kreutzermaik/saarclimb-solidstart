import { AuthSession, AuthUser } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { User } from "./types/User";

export default class Session {
  private static session: AuthSession;
  private static currentUser: User;

  /**
   * get supabase session
   * @returns
   */
  static async getSession(): Promise<AuthSession> {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      this.session = session;
    });
    return this.session;
  }

  /**
   * check if user is logged in
   * @returns
   */
  static async isLoggedIn(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }

  /**
   * get currentUser from cache if available or session
   * @returns
   */
  static async getCurrentUser(): Promise<User> {
    if (await this.getSession()) {
      this.setCurrentUser((await this.getSession()).user);
      return this.currentUser;
    }
  }

  /**
   * get current user id from session
   * @returns
   */
  static async getCurrentUserId(): Promise<string> {
    let session = await this.getSession();
    return session?.user.id;
  }

  /**
   * set current user
   * @param userData
   */
  static async setCurrentUser(userData: AuthUser) {
    this.currentUser = {
      uid: userData?.id,
      email: userData?.email,
      name: userData?.user_metadata["full_name"],
      avatar_url: userData?.user_metadata["avatar_url"],
    } as User;
  }

  /**
   * update username in session
   */
  static async updateUserInSession(username: string) {
    await supabase.auth.updateUser({ data: { full_name: username } });
  }
}
