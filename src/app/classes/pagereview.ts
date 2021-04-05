import { User } from "./user";

export class PageReviewPost{
    id: number;
    stars: number;
    userId: number;
}

export class PageReviewGet{
    id: number;
    stars: number;
    userId: number;
    user: User;
}