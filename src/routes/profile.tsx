import { createSignal, onMount, Show } from "solid-js";
import SupabaseService from "~/api/supabase-service";
import imageCompression from "browser-image-compression";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import Session from "~/session";
import { User } from "~/types/User";
import DataProvider from "../data-provider";
import NotLoggedIn from "~/components/ui/NotLoggedIn";
import Header from "~/components/ui/Header";
import { Button } from "~/components/ui/Button";
import {getSummedPoints, isLoggedIn, setUserPoints, userPoints, userImage} from "~/store";
import ChartVisitedGyms from "~/components/features/ChartVisitedGyms";
import NumberAnimation from "~/components/ui/NumberAnimation";

export default function Profile() {
  const [user, setUser] = createSignal<User>();
  const [finishedEvents, setFinishedEvents] = createSignal<number>();

  onMount(async () => {
    setUser(await Session.getCurrentUser());
    setUserPoints(await getSummedPoints());
    if (userPoints() === 0) {
      getSummedPoints().then((points: any) => setUserPoints(points));
    }
    await fetchEventsCount();
  });

  /**
   * get number of finished events per user
   */
  async function fetchEventsCount() {
    let events = (await SupabaseService.getEvents()).events;
    if (events) setFinishedEvents(events.length);
  }

  /**
   * update avatar
   * @param e
   */
  async function handleUpload(e: any) {
    closeDialog();

    let file: File = e.target.files[0];

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });
      await SupabaseService.updateAvatar(compressedFile);
      await DataProvider.updateAvatarUrlInCache();


    } catch (error) {
      console.log(error);
    }
  }

  /**
   * open dialog for changing profile picture
   */
  function openDialog() {
    document.getElementById("image-upload-dialog")?.classList.remove("hidden");
  }

  /**
   * hide dialog
   */
  function closeDialog() {
    document.getElementById("image-upload-dialog")?.classList.add("hidden");
  }

  return (
    <main class="text-center mx-auto text-gray-700 mb-20">
      <Header text="Profil" />

      <Show when={isLoggedIn()} fallback={() => <NotLoggedIn />} keyed>
        <Show when={user()} fallback={() => <LoadingSpinner />} keyed>
          <div
            class="userImage mx-auto w-20 h-20 mt-4 cursor-pointer border-secondary border-2 hover:opacity-80"
            style={`background-image: url(${userImage()})`}
            onClick={openDialog}
          />

          <div
            id="image-upload-dialog"
            class="relative z-10 hidden"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div class="fixed inset-0 z-10 overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3
                          class="text-base font-semibold leading-6 text-gray-900"
                          id="modal-title"
                        >
                          <p class="text-left">Profilbild ändern</p>
                        </h3>
                        <br />
                        <div class="m-2 w-full">
                          <input
                            type="file"
                            accept="image/*"
                            id="file-input"
                            onChange={(e) => handleUpload(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <Button
                      text="Abbrechen"
                      type="secondary"
                      onClick={closeDialog}
                      outline="true"
                      rounded="true"
                      width="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br />

          <div class="card card-compact shadow-xl mx-auto max-w-sm opacity-90 gradient-lightblue text-white">
            <div class="card-body">
              <h2 class="card-title mx-auto">Persönliche Daten</h2>
              <p class="py-1">Name: {user().name}</p>
              <p class="py-1">Email: {user().email}</p>
            </div>
          </div>

          <br />


          <div class="card card-compact shadow-xl mx-auto max-w-sm gradient-orange text-white">
            <div class="card-body">
              <Show when={userPoints() >= 0} fallback={<LoadingSpinner />} keyed>
                <h2 class="card-title mx-auto">
                  <NumberAnimation targetValue={userPoints()}/>
                </h2>
              </Show>
              <p class="py-1">Punkte gesamt</p>
            </div>
          </div>

          <br/>

          <div class="card card-compact shadow-xl mx-auto max-w-sm gradient-purple text-white">
            <div class="card-body">
              <Show when={finishedEvents()} fallback={<LoadingSpinner />} keyed>
                <h2 class="card-title mx-auto">
                  <NumberAnimation targetValue={finishedEvents()} />
                </h2>
              </Show>
              <p class="py-1">Absolvierte Trainingseinheiten</p>
            </div>
          </div>

          <br/>

          <div class="card card-compact shadow-xl mx-auto max-w-sm gradient-green text-white">
            <h2 class="card-title mx-auto py-4">Besuchte Hallen</h2>
            <ChartVisitedGyms />
          </div>

        </Show>
      </Show>
    </main>
  );
}
