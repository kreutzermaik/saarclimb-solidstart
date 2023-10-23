import { createSignal, createEffect } from "solid-js";
import SupabaseService from "./api/supabase-service.js";
import Session from "./session";
import type { Gym } from "./types/Gym";

// Reaktive Werte erstellen
export const [userImage, setUserImage] = createSignal<any>("");
export const [userPoints, setUserPoints] = createSignal<any>(Promise.resolve(0));
export const [isLoggedIn, setIsLoggedIn] = createSignal(false);
export const [currentGymId, setCurrentGymId] = createSignal(Promise.resolve(null));
export const [currentGym, setCurrentGym] = createSignal({} as Gym);
export const [gyms, setGyms] = createSignal([] as Gym[]);

// Nebeneffekte
createEffect(() => {
    Session.isLoggedIn().then(value => setIsLoggedIn(value));
    getSummedPoints().then((points: any) => setUserPoints(points));
    fetchUsersCurrentGym().then(gymId => setCurrentGymId(gymId));
    fetchGyms().then(value => {
        if (value) setGyms(value);
    });
});

/**
 * sum up all points of current user
 * show in profile page
 * @returns
 */
export async function getSummedPoints(): Promise<number> {
    let summedPoints: number = 0;
    const pointsArray = (await SupabaseService.getCurrentPoints())?.points?.points;
    if (pointsArray !== null && pointsArray !== undefined) {
        pointsArray.map((item: any) => {
            summedPoints += item.value;
        });
    } else {
        summedPoints = 0;
    }
    return summedPoints;
}

/**
 * fetch gym for current user
 * @returns
 */
export async function fetchUsersCurrentGym(): Promise<any> {
    try {
        return (await SupabaseService.getCurrentGym()).gym?.gym;
    } catch (err: any) {
        console.log(err);
    }
}

/**
 * fetch all gyms
 * @returns
 */
async function fetchGyms(): Promise<Gym[] | undefined> {
    try {
        let result = (await SupabaseService.getGyms()).gym;
        return result?.map((item: { [x: string]: any }) => {
            const {id, name, grades} = item;
            return {id, name, grades} as Gym;
        });
    } catch (err: any) {
        console.log(err);
    }
}
