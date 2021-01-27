import { CartGet } from "./cartGet";
import { HelpProyect } from "./helpProyect";
import { User } from "./user";

export class OrderPost{
    id: number;
    num: string;
    totalPrice: number;
    userId: number;
    helpProyectId: number;
}

export class OrderGet{
    id: number;
    num: string;
    totalProce: number;
    userId: number;
    helpProyectId: number;
    user: User;
    helpProyect: HelpProyect
    carts: CartGet[];
}