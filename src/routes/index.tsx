import { createSignal, onMount, Show } from "solid-js";
import DataProvider from "~/data-provider";
import Session from "~/session";
import NotLoggedIn from "~/components/ui/NotLoggedIn";
import Header from "~/components/ui/Header";
import Calendar from "~/components/features/Calendar";
import PlanerCompact from "~/components/features/PlanerCompact";

export default function Home() {
  const [loggedIn, setLoggedIn] = createSignal(false);

  /**
   * gets called on init
   */
  onMount(async () => {
    if (await Session.isLoggedIn()) {
      setLoggedIn(true);
      await DataProvider.initUserData();
    }
  });

  return (
    <main class="text-center mx-auto text-gray-700">
      <Header text="Dashboard" />

      <Show when={loggedIn()} fallback={() => <NotLoggedIn />} keyed>
        <PlanerCompact />
        <br />
        <div class="card card-compact shadow-xl bg-white">
          <div class="card-body">
            <Calendar />
          </div>
        </div>
      </Show>
    </main>
  );
}
