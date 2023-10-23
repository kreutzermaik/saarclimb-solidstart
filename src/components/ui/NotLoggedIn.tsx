import { A } from "solid-start";

export default function NotLoggedIn() {
    return (
        <main class="text-center mx-auto text-gray-700 p-4">
            <div class="card w-96 bg-base-100 shadow-xl mx-auto">
                <svg class="w-2/3 mx-auto text-error" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
                </svg>
                <div class="card-body">
                    <h2 class="card-title">Für diese Seite musst du eingeloggt sein!</h2>
                    <div class="card-actions justify-center py-4">
                        <button class="btn btn-error">
                            <A href="/login" id="goto-login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Zum Login</A>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
