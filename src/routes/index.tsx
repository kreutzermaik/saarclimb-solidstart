import { onMount, Show } from "solid-js";
import DataProvider from "~/data-provider";
import NotLoggedIn from "~/components/ui/NotLoggedIn";
import Header from "~/components/ui/Header";
import Calendar from "~/components/features/Calendar";
import PlanerCompact from "~/components/features/PlanerCompact";
import {autoLogin} from "~/test/autoLogin";
import {setIsLoggedIn, isLoggedIn} from "~/store";

export default function Home() {

  /**
   * gets called on init
   */
  onMount(async () => {
    if (isLoggedIn()) {
      setIsLoggedIn(true);
      await DataProvider.initUserData();
    } else if (!isLoggedIn() && process.env.NODE_ENV === "development") {
      await autoLogin();
      setIsLoggedIn(true);
    }
  });

  return (
    <main class="text-center mx-auto text-gray-700">
      <Header text="Dashboard" />

      <Show when={isLoggedIn()} fallback={() => <NotLoggedIn />} keyed>
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
