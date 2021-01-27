import { CategoryPost } from "./categoryPost";
import { Supplier } from "./supplier";
import { Subcategory } from "./subCategory";

export class ProductGet{
    id: number;
    name: string;
    description: Text;
    price: number;
    image: any;
    numSellOnWeek: number;
    isTrent: boolean;
    categoryId: number;
    subcategoryId: number;
    supplierId: number;
    category: CategoryPost;
    subcategory: Subcategory;
    supplier: Supplier;
    isOffer: boolean;
    priceOffer: number;
    unit: string;
}