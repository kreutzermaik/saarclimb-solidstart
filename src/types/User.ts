import { Point } from "./Point"

export type User = {
    uid: string,
    email: string,
    name: string,
    avatar_url: string,
    gym?: number,
    points?: Point[],
    boardId?: number
} 