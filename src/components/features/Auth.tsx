import { supabase } from '../../../supabase';
import { createSignal, Show } from "solid-js";
import { useNavigate } from 'solid-start';
import { Button } from '../ui/Button';
import { A } from '@solidjs/router';
import DataProvider from '~/data-provider';
import SupabaseService from '~/api/supabase-service';
import Cache from '~/cache';
import Toast from "~/components/ui/Toast";

type AuthProps = {
  type: string
}

export default function Auth(props: AuthProps) {

  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const navigate = useNavigate();

  /**
   * register with email and password
   */
  async function registerWithEmail() {
    const { data, error } = await supabase.auth.signUp({
      email: email(),
      password: password(),
    })

    if (error) {
      new Toast().push({title: Toast.REGISTER_ERROR_MESSAGE, content: error.message, style: 'error', duration: 5000});
      return;
    }

    await SupabaseService.addUser({uid: data.user?.id, email: data.user?.email, name: name(), avatar_url: ''});
    await DataProvider.initUserData()

    new Toast().push({content: Toast.REGISTERED_MESSAGE, style: 'success', duration: 3000});

    navigate('/');
  }

  /**
   * login with email and password
  */
  async function loginWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email(),
      password: password(),
    })

    if (error) {
      new Toast().push({title: Toast.LOGIN_ERROR_MESSAGE, content: error.message, style: 'error', duration: 5000});
      return;
    }

    navigate('/');
  }

  return (
    <div>
      <Show when={props.type === 'login'}  keyed>
        <div class="login-container p-6 mx-auto space-y-4 md:space-y-6 sm:p-8">
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="email" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">E-Mail Adresse</label>
              <input type="email" name="email" onChange={(e: any) => { setEmail(e.target.value) }} id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@email.com" required />
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Passwort</label>
              <input type="password" name="password" onChange={(e: any) => { setPassword(e.target.value) }} id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div id="login">
              <Button text="Einloggen" type="secondary" onClick={loginWithEmail}/>
            </div>
            <hr />
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Du hast noch keinen Account? <A href="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrieren</A>
            </p>
          </form>
        </div>
      </Show>

      <Show when={props.type === 'register'} keyed>
        <div class="login-container p-6 mx-auto space-y-4 md:space-y-6 sm:p-8">
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="name" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Vollständiger Name</label>
              <input type="name" name="name" onChange={(e: any) => { setName(e.target.value); Cache.setCacheItem('username', e.target.value) }} id="name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Max Mustermann" required />
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">E-Mail Adresse</label>
              <input type="email" name="email" onChange={(e: any) => { setEmail(e.target.value) }} id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@email.com" required />
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Passwort</label>
              <input type="password" name="password" onChange={(e: any) => { setPassword(e.target.value) }} id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <Button text="Registrieren" type="secondary" onClick={registerWithEmail} />
            <hr />
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Zurück zum <A href="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</A>
            </p>
          </form>
        </div>
      </Show>
    </div>
  )
}