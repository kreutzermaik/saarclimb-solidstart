import { Show, createSignal, onMount } from "solid-js";
import ProgressCard from "~/components/features/ProgressCard";
import Header from "~/components/ui/Header";
import NotLoggedIn from "~/components/ui/NotLoggedIn";
import Session from "~/session";

export default function Progress() {
  const [loggedIn, setLoggedIn] = createSignal(false);

  onMount(async () => {
    if (await Session.isLoggedIn()) {
      setLoggedIn(true);
    }
  });
  return (
    <main class="text-center text-gray-700">
      <Header text="Fortschritt" />

      <Show when={loggedIn()} fallback={() => <NotLoggedIn />}>
        <ProgressCard />
      </Show>
    </main>
  );
}
