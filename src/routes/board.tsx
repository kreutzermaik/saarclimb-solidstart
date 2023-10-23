import { createSignal, onMount, For, onCleanup } from "solid-js";
import SupabaseService from "~/api/supabase-service";
import Header from "~/components/ui/Header";
import { TrophyIcon } from "~/components/ui/icons/TrophyIcon";
import { Gym } from "~/types/Gym";
import { User } from "~/types/User";
import Cache from "~/cache";
import { Point } from "~/types/Point";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import Session from "~/session";
import {currentGym, setCurrentGym} from "~/store";

export default function Board() {
  const [users, setUsers] = createSignal<User[]>();
  const [gyms, setGyms] = createSignal<Gym[]>([]);
  const [usersGym, setUsersGym] = createSignal<any>();
  const [selectedGym, setSelectedGym] = createSignal<any>("");

  let subscription: any;

  /**
   * fetch all users
   */
  async function fetchAllUsers() {
    const { users, error } = await SupabaseService.getAllUsers();
    if (error) {
      console.log(error);
    } else {
      setUsers(users as User[]);
    }
  }

  /**
   * fetch gym for current user
   * @returns
   */
  async function fetchUsersCurrentGym() {
    try {
      let result = (await SupabaseService.getCurrentGym()).gym;
      setUsersGym(result);
      return result;
    } catch (err: any) {
      console.log(err);
    }
  }

  /**
   * fetch all gyms
   * @returns
   */
  async function fetchGyms() {
    try {
      let result = (await SupabaseService.getGyms()).gym;
      const gyms = result.map((item: { [x: string]: any }) => {
        const { id, name, grades } = item;
        return { id, name, grades } as Gym;
      });
      setGyms(result as Gym[]);
      return gyms;
    } catch (err: any) {
      console.log(err);
    }
  }

  /**
   * sorted users by points
   * @returns {User[]}
   */
  function getSortedUsers() {
    let currentGymObj: Gym;
    if (Cache.getCacheItem("currentGym")) {
      currentGymObj = JSON.parse(Cache.getCacheItem("currentGym"));
    } else {
      currentGymObj = currentGym();
    }

    const usersWithPoints = users().filter(
      (user: User) => user.points !== null
    );

    if (currentGym()) {
      const filteredUsers = usersWithPoints.map((user: User) => {
        let points: Point[];

        points = user.points.filter(
          (point: Point) => Number(point.gymId) === currentGymObj.id
        );

        return {
          uid: user.uid,
          name: user.name,
          avatar_url: user.avatar_url,
          points: points[0] != undefined ? points[0].value : 0,
          boardId: 0,
        };
      });

      const sortedUsers = filteredUsers.sort((a: any, b: any) => {
        return b.points - a.points;
      });

      // Set the boardId of each user to be the same if the points are the same
      for (let i = 0; i < sortedUsers.length; i++) {
        if (sortedUsers[i].points == sortedUsers[i - 1]?.points) {
          sortedUsers[i].boardId = sortedUsers[i - 1].boardId;
        } else {
          sortedUsers[i].boardId = i + 1;
        }
      }

      return sortedUsers;
    }
  }

  /**
   * update variables on gym change and set cacheItem
   * @param gym
   */
  async function changeGym(gym: string) {
    setSelectedGym(gym);
    const { id, logo, grades } = (await SupabaseService.getGymByName(gym)).gym;
    if (usersGym() !== undefined && usersGym().gym === null) {
      await SupabaseService.updateUserGym(id);
    }
    setCurrentGym({ id: id, name: gym, logo: logo, grades: grades })
    await fetchAllUsers();
  }

  /**
   * on subscription insert
   * @param payload
   */
  function onInsert(payload: any) {
    setUsers((prev: any) => [...prev, payload.new]);
  }

  /**
   * on subscription update
   */
  async function onUpdate() {
    await fetchAllUsers();
  }

  /**
   * on subscription delete
   * @param payload
   */
  function onDelete(payload: any) {
    setUsers((prev) => prev.filter((item) => item.uid != payload.old.uid));
  }

  /**
   * gets called on init
   */
  onMount(async () => {
    subscription = SupabaseService.subscribeToTable(
      "users",
      "users-channel",
      onInsert,
      onUpdate,
      onDelete
    );
    await fetchAllUsers();
    await fetchGyms();

    if (await Session.isLoggedIn()) {
      let currentGymId: number = 0;
      let currentGymName: string = "";

      if (Cache.getCacheItem("currentGym")) {
        currentGymId = JSON.parse(Cache.getCacheItem("currentGym")).id;
        currentGymName = JSON.parse(Cache.getCacheItem("currentGym")).name;
      } else {
        currentGymId = (await fetchUsersCurrentGym()).gym;
        if (currentGymId) {
          currentGymName = (await SupabaseService.getGymNameById(currentGymId))
            .gym.name;
        }
      }

      const { id, name, logo, grades } = (
        await SupabaseService.getGymByName(currentGymName)
      ).gym;

      setCurrentGym({ id: id, name: name, logo: logo, grades: grades });
    }
  });

  /**
   * gets called on:
   * 1) page reload
   * 2) navigation to another page
   */
  onCleanup(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  return (
    <main class="mx-auto text-gray-700">
      <Header text="Bestenliste" />

      <div class="card card-compact shadow-xl bg-white text-left">
        <div class="card-body">
          <select
              id="gyms"
              onChange={(e: any) => {
                changeGym(e.target.value);
              }}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>
              {currentGym() ? currentGym().name : "Bitte auswählen..."}
            </option>
            {gyms()
                ? gyms().map((gym: Gym) => {
                  if (currentGym() && gym.name !== currentGym().name)
                    return <option value={gym.name}>{gym.name}</option>
                })
                : ''}
          </select>

          {users() ? (
            <div class="px-2">
              <table class="table table-zebra w-full shadow-md board-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Benutzer</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={getSortedUsers()}>
                    {(user, i) => {
                      return (
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td class="px-3 py-2 w-1/12">
                            {i() === 0 ? (
                              <TrophyIcon color="text-custom-gold" />
                            ) : i() === 1 ? (
                              <TrophyIcon color="text-custom-silver" />
                            ) : i() === 2 ? (
                              <TrophyIcon color="text-custom-bronze" />
                            ) : (
                              user.boardId
                            )}
                          </td>
                          <td class="px-3 py-2 w-10/12">
                            <div class="flex gap-5">
                              <div
                                class="userImage w-10 h-10"
                                style={`background-image: url(${user.avatar_url})`}
                              />
                              <strong>{user.name}</strong>
                            </div>
                          </td>
                          <td class="px-3 py-2 w-1/12">{user.points}</td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </main>
  );
}
