import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import SupabaseService from "~/api/supabase-service";
import { Button } from "../ui/Button";
import { Plan } from "~/types/Plan";
import Cache from "~/cache";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { TrashIcon } from "../ui/icons/TrashIcon";
import { InfoIcon } from "../ui/icons/InfoIcon";
import Toast from "~/components/ui/Toast";

export default function Planer() {
  let subscription: any | null;

  const [planData] = createResource(fetchPlan);
  const [plan, setPlan] = createSignal<Plan[]>();

  /**
   * fetch data from SupabaseService
   * @returns
   */
  async function fetchPlan() {
    try {
      let result = (await SupabaseService.getPlan()).planer.plan;
      return result;
    } catch (err: any) {
      console.log(err);
    }
  }

  /**
   * save input changes
   * @param element
   * @param day
   */
  function setInputValue(element: HTMLInputElement, day: Plan) {
    const checkbox = document.querySelector(
      ".".concat(day.day, "-checkbox")
    ) as HTMLInputElement;
    // set value
    day.value = element.value;
    // update ui elements
    if (element.value === "") {
      element.classList.remove("border-primary");
      element.classList.add("placeholder-gray-500");
      element.classList.add("bg-neutral");
      checkbox.checked = false;
    } else {
      element.classList.remove("bg-neutral");
      element.classList.add("border-primary");
    }
  }

  /**
   * update plan in supabase
   */
  function updatePlan() {
    try {
      SupabaseService.updatePlan(plan);
      new Toast().push({content: Toast.PLAN_UPDATED_MESSAGE, style: 'success', duration: 3000});
    } catch (err: any) {
      new Toast().push({title: Toast.PLAN_UPDATED_ERROR_MESSAGE, style: 'error', duration: 5000});
    }
  }

  /**
   * resetPlan in UI
   */
  function resetPlan() {
    plan()?.map((day) => {
      day.value = "";
      day.checked = false;
    });
    setPlan(
      plan()?.map(({ day, value, checked }) => ({ day, value, checked }))
    );
    updatePlan();
  }

  /**
   * reset single day in UI
   * @param day
   */
  function resetDay(day: Plan) {
    day.value = "";
    day.checked = false;
    setPlan(
      plan()?.map(({ day, value, checked }) => ({ day, value, checked }))
    );
  }

  createEffect(() => {
    const planCache: any = Cache.getCacheItem("plan");
    if (planCache) {
      setPlan(JSON.parse(planCache));
    } else {
      const returnedValue = planData();
      if (returnedValue) {
        setPlan(returnedValue);
        Cache.setCacheItem("plan", returnedValue);
      }
    }
  });

  /**
   * on subscription insert
   * @param payload
   */
  function onInsert(payload: any) {
    setPlan((prev: any) => [...prev, payload.new]);
  }

  /**
   * on subscription update
   */
  async function onUpdate() {
    setPlan(await fetchPlan());
    Cache.setCacheItem("plan", plan());
  }

  /**
   * on subscription delete
   * @param payload
   */
  function onDelete(payload: any) {
    setPlan((prev: any) =>
      prev.filter((item: any) => item.day != payload.old.day)
    );
  }

  onMount(() => {
    subscription = SupabaseService.subscribeToTable(
      "planer",
      "planner-channel",
      onInsert,
      onUpdate,
      onDelete
    );
  });

  onCleanup(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
    Cache.removeCacheItem("plan");
  });

  return (
    <main class="text-center text-gray-700">
      <Show when={plan()} fallback={() => <LoadingSpinner />} keyed>
        <div class="mb-6">
          <h2 class="card-title float-left">Plane deine Trainingseinheiten</h2>
          <div
            class="tooltip tooltip-left tooltip-primary float-right mb-4 z-50"
            data-tip="Hier kannst du für die ganze Woche deine geplanten
                  Bouldereinheiten sowie Workouts planen. Gib dazu einfach eine Einheit in ein Textfeld ein und klick auf Speichern. 
                  Durch das Reset-Symbol setzt du den Wert für ein Eingabefeld zurück. 
                  Über Zurücksetzen werden alle eingegebenen Werte geleert."
          >
            <InfoIcon />
          </div>

          <table class="table table-zebra w-full shadow-md">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Geplante Einheit</th>
              </tr>
            </thead>
            <tbody>
              <For each={plan()}>
                {(day) => {
                  return (
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td class="px-3 py-2">
                        <strong>{day.day.slice(0, 2)}</strong>
                      </td>
                      <td class="px-3 py-2 w-10/12">
                        <div class="flex items-center justify-start gap-3">
                          <input
                            value={day.value}
                            onChange={(e) =>
                              setInputValue(e.currentTarget, day)
                            }
                            type="text"
                            id={day.day}
                            class={`${
                              day.value !== ""
                                  ? "border-primary"
                                  : "bg-neutral text-black placeholder-gray-500"
                            } border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-7xl`}
                            placeholder="Nichts geplant"
                            required
                          />
                          {day.value !== "" ? (
                            <button onClick={() => resetDay(day)}>
                              <TrashIcon />
                            </button>
                          ) : (
                            <div class="w-6"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }}
              </For>
            </tbody>
          </table>
        </div>
      </Show>

      <Button
        text="Speichern"
        type="secondary"
        onClick={updatePlan}
        width="w-full"
      />
      <Button
        text="Zurücksetzen"
        type="secondary"
        onClick={resetPlan}
        outline="true"
        width="w-full"
      />
    </main>
  );
}
