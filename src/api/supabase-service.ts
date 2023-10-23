import { Event } from "~/types/Event";
import { supabase } from "../../supabase";
import Session from "~/session";

export default class SupabaseService {
  public static async addUser(user: any) {
    const { data, error } = await supabase.from("users")
      .insert(user)
    return { data, error };
  }

  public static async getAllUsers() {
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("name", { ascending: true });
    return { users, error };
  }

  public static async getCurrentUserName() {
    let { data: user, error } = await supabase
      .from("users")
      .select("name")
      .eq("uid", await Session.getCurrentUserId())
      .single();
    return { user, error };
  }

  public static async getCurrentAvatarUrl() {
    let { data: avatar_url, error } = await supabase
      .from("users")
      .select("avatar_url")
      .eq("uid", await Session.getCurrentUserId())
      .single();
    return { avatar_url, error };
  }

  public static async getCurrentPoints() {
    let { data: points, error } = await supabase
      .from("users")
      .select("points")
      .eq("uid", await Session.getCurrentUserId())
      .single();
    return { points, error };
  }

  public static async updateUserPoints(points: any) {
    let { data, error } = await supabase
      .from("users")
      .update({points: points})
      .eq("uid", await Session.getCurrentUserId())
    return { points, error };
  }

  public static async updateUser(avatarUrl: string) {
    const { data, error } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("uid", await Session.getCurrentUserId());
  }

  public static async updateUserGym(gymId: number) {
    const { data, error } = await supabase
      .from("users")
      .update({ gym: gymId })
      .eq("uid", await Session.getCurrentUserId());
  }

  public static async addPlan() {
    const { data, error } = await supabase
      .from("planer")
      .insert([{ uid: await Session.getCurrentUserId() }]);
  }

  public static async getPlan() {
    let { data: planer, error } = await supabase
      .from("planer")
      .select("*")
      .eq("uid", await Session.getCurrentUserId())
      .single();
    return { planer, error };
  }

  public static async updatePlan(plan: any) {
    const { data, error } = await supabase
      .from("planer")
      .update({ plan: plan() })
      .eq("uid", await Session.getCurrentUserId());
  }

  public static subscribeToTable(
    table: string,
    channel: string,
    onInsert?: any,
    onUpdate?: any,
    onDelete?: any
  ) {
    let subscription: any;
    supabase
      .channel(channel)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              onInsert(payload);
              break;
            case "UPDATE":
              onUpdate();
              break;
            case "DELETE":
              onDelete(payload);
              break;
          }
        }
      )
      .subscribe();
    return subscription;
  }

  public static async getAvatarBucket() {
    const { data: signedURL, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(await Session.getCurrentUserId(), 600000);

    return { signedURL, error };
  }

  public static async getAvatarList() {
    const { data, error } = await supabase.storage.from("avatars").list();
    return { data, error };
  }

  public static async getAvatar() {
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(await Session.getCurrentUserId(), 60000000);
    return { data, error };
  }

  public static async initAvatar() {
    const fileName = "avatar.png";
    const { data, error } = await supabase.storage
      .from("avatars")
      .copy(fileName, await Session.getCurrentUserId());
  }

  public static async updateAvatar(file: any) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .update(await Session.getCurrentUserId(), file as File);
  }

  public static async addEvent(event: Event) {
    const { data, error } = await supabase
      .from("events")
      .insert(event)
      .eq("userid", await Session.getCurrentUserId());
    return { data, error };
  }

  public static async removeEvent(event: Event): Promise<void> {
    await supabase
        .from("events")
        .delete()
        .eq("userid", await Session.getCurrentUserId())
        .eq("title", event.title)
        .eq("location", event.location)
        .eq("date", event.date);
  }

  public static async removeEventByDate(event: string, date: string): Promise<void> {
    await supabase
        .from("events")
        .delete()
        .eq("userid", await Session.getCurrentUserId())
        .eq("title", event)
        .eq("date", date);
  }

  public static async getEvents() {
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("userid", await Session.getCurrentUserId());
    return { events, error };
  }

  public static async getEventsByLocation(location: string) {
    const {data: events, error} = await supabase
        .from("events")
        .select("*")
        .eq("userid", await Session.getCurrentUserId())
        .eq("location", location);
    return {events, error};
  }

  public static async getGyms() {
    const { data: gym, error } = await supabase.from("gym").select("*");
    return { gym, error };
  }

  public static async getProgress(gymId: number) {
    const { data: progress, error } = await supabase
      .from("progress")
      .select("*")
      .eq("gymid", gymId)
      .eq("userid", await Session.getCurrentUserId());
    return { progress, error };
  }

  public static async insertProgress(progress: any, gymId: number) {
    const { data, error } = await supabase
      .from("progress")
      .upsert({
        progress: progress,
        userid: await Session.getCurrentUserId(),
        gymid: gymId,
      });
  }

  public static async updateProgress(progress: any, gymId: number) {
    const { data, error } = await supabase
      .from("progress")
      .update({ progress: progress })
      .eq("gymid", gymId)
      .eq("userid", await Session.getCurrentUserId());
  }

  public static async getCurrentGym() {
    const { data: gym, error } = await supabase
      .from("users")
      .select("gym")
      .eq("uid", await Session.getCurrentUserId())
      .single();
    return { gym, error };
  }

  public static async getGymNameById(gymId: number) {
    const { data: gym, error } = await supabase
      .from("gym")
      .select("name")
      .eq("id", gymId)
      .single();
    return { gym, error };
  }

  public static async getGymByName(gymName: string) {
    const { data: gym, error } = await supabase
      .from("gym")
      .select("*")
      .eq("name", gymName)
      .single();
    return { gym, error };
  }
}
