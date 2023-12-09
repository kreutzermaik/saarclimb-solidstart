// @ts-ignore
import {supabase} from "../../supabase";
// @ts-ignore
import DataProvider from "~/data-provider";

/**
 * Auto login for lighthouse tests
 */
export async function autoLogin() {
    await supabase.auth.signInWithPassword({
        email: "cypress@user.com",
        password: "test123",
    })
    await DataProvider.initUserData();
}