import { ProductGet } from "./productGet";

export class CartLocal{
    id: number;
    quantity: number;
    totalPrice: number;
    isBuyed: boolean;
    productId: number;
    product: ProductGet;
}