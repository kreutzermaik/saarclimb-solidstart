import SupabaseService from "./api/supabase-service";
import Cache from "./cache";
import Session from "./session";
import {setIsLoggedIn, setUserImage, userImage} from "~/store";

export default class DataProvider {
  /**
   * init user data that is required for the app
   */
  static async initUserData() {
    if (await Session.getCurrentUser()) {
      if ((await Session.getCurrentUser()).name === undefined) {
        await Session.updateUserInSession(JSON.parse(Cache.getCacheItem("username")));
      }
    }
    await this.addAvatar();
    await this.addPlan();
    await this.initUserPoints();
    setIsLoggedIn(true);
  }

  /**
   * returns provider from cache
   * @returns
   */
  static checkProvider(): string {
    if (Cache.getCacheItem("sb-ybeongwjjfdkgizzkmsc-auth-token")) {
      return JSON.parse(
        Cache.getCacheItem("sb-ybeongwjjfdkgizzkmsc-auth-token")
      ).user.app_metadata.provider;
    }
  }

  /**
   * add avatar if not exists
   * gets only called if 'initAvatar' is not in the cache
   */
  static async addAvatar() {
    if (!Cache.getCacheItem("initAvatar")) {
      let avatar = await SupabaseService.getAvatar();
      if (avatar.data === null) {
        await SupabaseService.initAvatar();
      }
      Cache.setCacheItem("initAvatar", true);
    }
  }

  /**
   * update avatar url in cache
   */
  static async updateAvatarUrlInCache() {
    let url = (await SupabaseService.getAvatar()).data.signedUrl;
    if (url) {
      setUserImage(url);
      await this.updateUserWithAvatarUrl(url);
    }
  }

  /**
   * update user table with avatar_url
   * @param avatarUrl
   */
  static async updateUserWithAvatarUrl(avatarUrl: string) {
    await SupabaseService.updateUser(avatarUrl);
  }

  /**
   * add plan if not exists
   * gets only called if 'initPlan' is not in the cache
   */
  static async addPlan() {
    if (!Cache.getCacheItem("initPlan")) {
      let plan = await SupabaseService.getPlan();
      if (plan.planer === null) {
        await SupabaseService.addPlan();
      }
      Cache.setCacheItem("initPlan", true);
    }
  }

  /**
   * init points in user table for all gyms with value 0
   * gets only called if 'initPoints' is not in the cache
   */
  static async initUserPoints(): Promise<void> {
    if (!Cache.getCacheItem("initPoints")) {
      let user = await SupabaseService.getCurrentPoints();
      if (!user?.points?.points) {
        let pointsArray: { gymId: string; value: number; }[] = [];
        let gyms = (await SupabaseService.getGyms()).gym;
        gyms?.map((gym): void => {
          pointsArray.push({gymId: gym.id.toString(), value: 0})
        })
        await SupabaseService.updateUserPoints(pointsArray);
      }
      Cache.setCacheItem("initPoints", true);
    }
  }
}
