import {createSignal, For, onCleanup, onMount, Show} from "solid-js";
import SupabaseService from "~/api/supabase-service";
import {Plan} from "~/types/Plan";
import {A} from "solid-start";
import {LoadingSpinner} from "~/components/ui/LoadingSpinner";
import {CheckIcon} from "~/components/ui/icons/CheckIcon";
import {FailedIcon} from "~/components/ui/icons/FailedIcon";
import {UnusedIcon} from "~/components/ui/icons/UnusedIcon";
import {CheckDisabledIcon} from "~/components/ui/icons/CheckDisabledIcon";
import {ArrowDownIcon} from "~/components/ui/icons/ArrowDownIcon";
import {InfoIcon} from "~/components/ui/icons/InfoIcon";
import {Event} from "~/types/Event";
import Session from "~/session";
import AskLocationDialog from "~/components/features/AskLocationDialog";
import Toast from "~/components/ui/Toast";

export default function PlanerCompact() {
    const [plan, setPlans] = createSignal<Plan[]>([]);
    const [newEvent, setNewEvent] = createSignal<Event>();

    let subscription: any;

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
     * update ui and supabase plans
     * @param item
     */
    function updatePlan(item: Plan) {
        updateCalendar(item);
        item.checked = !item.checked;
        SupabaseService.updatePlan(plan);
    }

    /**
     * update calendar with finished training session
     * @param item
     */
    async function updateCalendar(item: Plan) {
        let event = item.value;
        let date = getClickedDay(item.day);
        setNewEvent({
            title: event,
            date: date,
            userid: await Session.getCurrentUserId(),
            location: '',
        });
        // open AskLocationDialog if event is a climbing event
        if (event.match("Kletter") || event.match("Boulder") || event.match("Climb")) {
            if (item.checked) openDialog();
            await SupabaseService.removeEventByDate(event, date);
        } else {
            if (item.checked) await SupabaseService.addEvent(newEvent());
            else await SupabaseService.removeEvent(newEvent());
        }
    }

    /**
     * get exact day of the week that was clicked in planer checkbox
     * @param day
     */
    function getClickedDay(day: string) {
        const today = new Date();
        const dayIndex = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].indexOf(day);
        const difference = dayIndex - today.getDay() + 1;
        today.setDate(today.getDate() + difference);
        return formatDate(today);
    }

    /**
     *
     * @param date
     */
    function formatDate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    /**
     * open dialog for adding a new event
     */
    function openDialog() {
        document.getElementById("ask-location-dialog")?.classList.remove("hidden");
    }

    /**
     * check if day is in past of week
     * @param day
     * @returns
     */
    function isDayPast(day: Plan): boolean {
        let dayToCompare = new Date();
        let weekday = new Array(7);
        weekday[1] = "Montag";
        weekday[2] = "Dienstag";
        weekday[3] = "Mittwoch";
        weekday[4] = "Donnerstag";
        weekday[5] = "Freitag";
        weekday[6] = "Samstag";
        weekday[7] = "Sonntag";

        for (let i = 0; i < weekday.length; i++) {
            if (weekday[i] === day.day) {
                if (dayToCompare.getDay() === 0 && i < 7) return true;
                else if (i < dayToCompare.getDay()) return true;
                else if (i >= dayToCompare.getDay()) return false;
            }
        }
        return false;
    }

    /**
     * show planned exercise as notification
     * @param item
     */
    function showPlannedExercise(item: Plan) {
        if (item.value !== '') {
            new Toast().push({title: Toast.PLANNED_EXERCISE, content: item.value, position: 'top-right', style: 'verified', duration: 5000});
        }
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        setPlans((prev: any) => [...prev, payload.new]);
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        setPlans(await fetchPlan());
    }

    /**
     * on subscription delete
     * @param payload
     */
    function onDelete(payload: any) {
        setPlans((prev) => prev.filter((item) => item.day != payload.old.day));
    }

    /**
     * gets called on init
     */
    onMount(async () => {
        subscription = SupabaseService.subscribeToTable(
            "planer",
            "planer-channel",
            onInsert,
            onUpdate,
            onDelete
        );
        setPlans(await fetchPlan());
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
        <main class="text-center mx-auto text-gray-700">
            <div class="card card-compact shadow-xl bg-white z-0">
                <div class="card-body">
                    <div>
                        <h2 class="card-title float-left">Wochenplan</h2>
                        <div
                            class="tooltip tooltip-left tooltip-primary float-right z-50"
                            data-tip="Hier kannst du für die ganze Woche deine geplanten
                  Bouldereinheiten sowie Workouts verfolgen. Über die Icons kannst du deine Einheiten abhaken, sofern du Sie erledigt hast.
                  Über das Pfeil-Symbol gelangst du zu deinem detaillierten Wochenplan."
                        >
                            <InfoIcon/>
                        </div>
                    </div>

                    <Show when={plan() !== undefined && plan().length > 0} fallback={<LoadingSpinner/>} keyed>
                        <table class="table w-full">
                            <thead>
                            <tr>
                                <For each={plan()}>
                                    {(day) => {
                                        return (
                                            <th class="bg-white text-black">
                                                <div onClick={() => showPlannedExercise(day)} class={day.value === '' ? 'cursor-default' : 'cursor-pointer'}>
                                                    {day.day.slice(0, 2)}
                                                </div>
                                            </th>
                                        );
                                    }}
                                </For>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <For each={plan()}>
                                    {(item) => {
                                        return (
                                            <td class="bg-white px-3 py-2">
                                                {isDayPast(item) &&
                                                !item.checked &&
                                                item.value !== "" ? (
                                                    <div onClick={() => updatePlan(item)}>
                                                        <div
                                                            class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary mb-4 z-50`}
                                                            data-tip={"Workout verpasst: " + item.value}
                                                        >
                                                            <FailedIcon/>
                                                        </div>
                                                    </div>
                                                ) : !isDayPast(item) &&
                                                !item.checked &&
                                                item.value !== "" ? (
                                                    <div onClick={() => updatePlan(item)}>
                                                        <div
                                                            class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary mb-4 z-50`}
                                                            data-tip={item.value}
                                                        >
                                                            <CheckDisabledIcon/>
                                                        </div>
                                                    </div>
                                                ) : item.checked ? (
                                                    <div onClick={() => updatePlan(item)}>
                                                        <div
                                                            class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary mb-4 z-50`}
                                                            data-tip={item.value}
                                                        >
                                                            <CheckIcon/>
                                                        </div>
                                                    </div>
                                                ) : !item.checked ? (
                                                    <div
                                                        class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary mb-4`}
                                                        data-tip="Kein Workout geplant">
                                                        <UnusedIcon/>
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                        );
                                    }}
                                </For>
                            </tr>
                            </tbody>
                        </table>
                    </Show>
                    <A href="/plan">
                        <ArrowDownIcon/>
                    </A>
                </div>
            </div>
            <AskLocationDialog newEvent={newEvent()}/>
        </main>
    );
}
