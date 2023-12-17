import { Show, onMount } from "solid-js";
import ProgressCard from "~/components/features/ProgressCard";
import Header from "~/components/ui/Header";
import NotLoggedIn from "~/components/ui/NotLoggedIn";
import DataProvider from "~/data-provider";
import {autoLogin} from "~/test/autoLogin";
import {setIsLoggedIn, isLoggedIn} from "~/store";

export default function Progress() {

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
    <main class="text-center text-gray-700">
      <Header text="Fortschritt" />

      <Show when={isLoggedIn()} fallback={() => <NotLoggedIn />}>
        <ProgressCard />
      </Show>
    </main>
  );
}
