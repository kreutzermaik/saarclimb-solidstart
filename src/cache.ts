import {setCurrentGym, setIsLoggedIn, setUserImage, setUserPoints} from "~/store";

export default class Cache {

    /**
     * get item from cache
     * @param item
     * @returns
     */
    static getCacheItem(item: string) {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem(item);
        }
    }

    /**
     * set item in cache
     * @param item
     * @param value
     */
    static setCacheItem(item: string, value: any) {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(item, JSON.stringify(value));
        }
    }

    /**
     * remove item from cache
     * @param item
     */
    static removeCacheItem(item: string) {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(item);
        }
    }

    /**
     * remove all items from cache
     */
    static clearOnLogout() {
        if (typeof window !== "undefined") {
            setUserImage("");
            setUserPoints(0);
            setIsLoggedIn(false);
            setCurrentGym();
        }
    }
}