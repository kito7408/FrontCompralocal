import { CategoryPost } from "./categoryPost";
import { Supplier } from "./supplier";
import { ProdMod } from "./prodModel";
import { DeliveryZone } from "./deliveryZone";
import { Subcategory } from "./subCategory";

export class ProductGet{
    id: number;
    name: string;
    description: any;
    price: number;
    image1: any;
    image2: any;
    image3: any;
    image4: any;
    image5: any;
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
    productModels: ProdMod[];
    toProv: boolean;
    daysToSend: string;
    numDaysToSend: number;
    numDaysToSend2: number;
    deliveryZones: DeliveryZone[];
}