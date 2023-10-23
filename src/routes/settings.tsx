import Cache from "~/cache";
import { supabase } from "../../supabase";
import { useNavigate } from "solid-start";
import Header from "~/components/ui/Header";
import { Button } from "~/components/ui/Button";
import {HelpIcon} from "~/components/ui/icons/HelpIcon";

export default function Settings() {
  const navigate = useNavigate();


  /**
   * logout and navigate to login page
   */
  async function logout() {
    const { error } = await supabase.auth.signOut();
    Cache.clearOnLogout();
    navigate("/login");
  }

  return (
    <main class="text-center mx-auto text-gray-700">
      <Header text="Einstellungen" />

      <div class="card card-compact shadow-xl bg-white">
        <div class="card-body">
          <div>
            <h2 class="card-title float-left">Hilfe</h2>
            <div class="float-right">
              <a href="https://saarclimb-docs.netlify.app/benutzerhandbuch/allgemein/"><HelpIcon /></a>
            </div>
          </div>

          <div class="text-left">
            <p>
              Bei Problemen oder Fragen wende dich bitte direkt an den mich, den Entwickler. Du kannst mich per
              E-Mail
              unter
              <b><a href="mailto:kreutzermaik123@web.de"> kreutzermaik123@web.de </a></b> erreichen.
              Alternativ findest du möglicherweise auch im <b><a
                href="https://saarclimb-docs.netlify.app/benutzerhandbuch/allgemein/"> Benutzerhandbuch </a></b>
              eine Antwort auf deine Fragen.
            </p>
          </div>

          <div class="text-left mt-2">
            <Button
              text="Ausloggen"
              type="secondary"
              outline="true"
              rounded="true"
              onClick={() => logout()}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
