import { ProductGet } from "./productGet";
import { User } from "./user";

export class CartGet{
    id: number;
    quantity: number;
    totalPrice: number;
    isBuyed: boolean;
    userId: number;
    productId: number;
    user: User;
    product: ProductGet;
}