import { For, createSignal, onMount } from "solid-js";
import { Button } from "../ui/Button";
import SupabaseService from "~/api/supabase-service";
import Session from "~/session";
import { Event } from "~/types/Event";
import { Gym } from "~/types/Gym";
import Toast from "~/components/ui/Toast";

type AddEventDialogProps = {
  date: any;
};

export default function AddEventDialog(props: AddEventDialogProps) {
  const [date, setDate] = createSignal("");
  const [event, setEvent] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [gyms, setGyms] = createSignal<Gym[]>([]);

  async function fetchGyms() {
    try {
      let result = (await SupabaseService.getGyms()).gym;
      const gyms = result.map((item: { [x: string]: any }) => {
        const { id, name, grades } = item;
        return { id, name, grades } as Gym;
      });
      setGyms(gyms);
      return gyms;
    } catch (err: any) {
      console.log(err);
    }
  }

  /**
   * add new event to supabase and close dialog
   */
  async function addEvent() {
    try {
      if (!event()) return;
      let newEvent: Event = {
        title: event(),
        date: date() !== "" ? date() : props.date(),
        userid: await Session.getCurrentUserId(),
        location: location(),
      };
      await SupabaseService.addEvent(newEvent);
      closeDialog();
      new Toast().push({content: Toast.EVENT_ADDED_MESSAGE, style: 'success', duration: 3000});
    } catch (err: any) {
      new Toast().push({content: Toast.EVENT_ADDED_ERROR_MESSAGE, style: 'error'});
    }
  }

  /**
   * hide dialog
   */
  function closeDialog() {
    document.getElementById("event-dialog")?.classList.add("hidden");
  }

  onMount(async () => {
    await fetchGyms();
  });

  return (
    <div
      id="event-dialog"
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
                    Training hinzufügen
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Füge hier eine Trainingseinheit hinzu. Dazu musst du alle
                      Felder ausfüllen und auf Speichern klicken. Die Einheit
                      wird anschließend in der Kalenderübersicht angezeigt.
                    </p>
                    <div class="m-2 w-full">
                      <div class="m-2">
                        <label
                          for="date"
                          class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                        >
                          Datum
                        </label>
                        <input
                          name="date"
                          datepicker-autohide
                          type="text"
                          onChange={(e: any) => {
                            setDate(e.target.value);
                          }}
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="2023-05-31"
                          value={props.date()}
                        />
                      </div>
                      <div class="m-2">
                        <label
                          for="event"
                          class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                        >
                          Trainingseinheit
                        </label>
                        <input
                          type="text"
                          name="event"
                          onChange={(e: any) => {
                            setEvent(e.target.value);
                          }}
                          id="email"
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Bouldern"
                        />
                      </div>
                      <div class="m-2">
                        <label
                          for="gyms"
                          class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                        >
                          Ort
                        </label>
                        <select
                          id="gyms"
                          onChange={(e: any) => {
                            setLocation(e.target.value);
                          }}
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option selected>Bitte auswählen...</option>
                          <For each={gyms()}>
                            {(gym) => {
                              return (
                                <option value={gym.name}>{gym.name}</option>
                              );
                            }}
                          </For>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button
                text="Speichern"
                type="secondary"
                onClick={addEvent}
                rounded="true"
                width="w-full"
                disabled={!event() || !props.date}
              />
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
  );
}
