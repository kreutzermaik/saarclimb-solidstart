import { createSignal, onMount, Show } from "solid-js";
import Planer from "~/components/features/Planer";
import Header from "~/components/ui/Header";
import NotLoggedIn from "~/components/ui/NotLoggedIn";
import Session from "~/session";

export default function Plan() {
  const [loggedIn, setLoggedIn] = createSignal(false);

  onMount(async () => {
    if (await Session.isLoggedIn()) {
      setLoggedIn(true);
    }
  });

  return (
    <main class="text-center mx-auto text-gray-700">
      <Header text="Wochenplaner" />

      <Show when={loggedIn()} fallback={() => <NotLoggedIn />}>
        <div class="card card-compact shadow-xl bg-white">
          <div class="card-body">
            <Planer />
          </div>
        </div>
      </Show>
    </main>
  );
}
