import { ProgressItem } from "./ProgressItem"

export type Gym = {
    id: number,
    name: string,
    logo?: string,
    grades?: ProgressItem[]
}