import { ProductGet } from "./productGet";

export class CartGet{
    id: number;
    quantity: number;
    totalPrice: number;
    isBuyed: boolean;
    productId: number;
    product: ProductGet;
}