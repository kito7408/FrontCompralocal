import { CategoryPost } from "./categoryPost";
import { Supplier } from "./supplier";
import { ProdMod } from "./prodModel";
// import { Subcategory } from "./subCategory";

export class ProductGet{
    id: number;
    name: string;
    description: Text;
    price: number;
    image1: any;
    image2: any;
    image3: any;
    image4: any;
    image5: any;
    numSellOnWeek: number;
    isTrent: boolean;
    categoryId: number;
    // subcategoryId: number;
    supplierId: number;
    category: CategoryPost;
    // subcategory: Subcategory;
    supplier: Supplier;
    isOffer: boolean;
    priceOffer: number;
    unit: string;
    productModels: ProdMod[];
}