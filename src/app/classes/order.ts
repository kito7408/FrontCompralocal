import { CartGet } from "./cartGet";
import { Direction } from "./direction";
import { HelpProyect } from "./helpProyect";
import { User } from "./user";

export class OrderPost{
    id: number;
    num: string;
    deliveryMethod: string;
    paymentMethod: string;
    paymentState: string;
    productsPrice: number;
    deliveryPrice: number;
    totalPrice: number;
    cupon: string;
    coment: string;
    userId: number;
    helpProyectId: number;
    directionId: number;
}

export class OrderGet{
    id: number;
    num: string;
    deliveryMethod: string;
    paymentMethod: string;
    paymentState: string;
    productsPrice: number;
    deliveryPrice: number;
    totalPrice: number;
    cupon: string;
    coment: string;
    userId: number;
    helpProyectId: number;
    directionId: number;
    user: User;
    helpProyect: HelpProyect;
    direction: Direction;
    carts: CartGet[];
}