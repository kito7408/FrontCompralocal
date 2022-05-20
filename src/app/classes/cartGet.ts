import { ProductGet } from "./productGet";
import { User } from "./user";
import { ProdMod } from "./prodModel";

export class CartGet{
    id: number;
    quantity: number;
    totalPrice: number;
    isBuyed: boolean;
    userId: number;
    productId: number;
    productModelId: number;
    user: User;
    product: ProductGet;
    productModel: ProdMod;
    comment: string;
}