import { User } from "./user";

export class ProdCommentPost{
    id: number;
    content: string;
    stars: number;
    userId: number;
    productId: number;
}

export class ProdCommentGet{
    id: number;
    content: string;
    stars: number;
    userId: number;
    productId: number;
    user: User;
}