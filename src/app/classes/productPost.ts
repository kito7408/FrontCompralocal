export class ProductPost{
    id: number;
    name: string;
    description: Text;
    price: number;
    image: any;
    numSellOnWeek: number;
    isTrent: boolean;
    location: string;   //local o externa
    categoryId: number;
    subcategoryId: number;
    supplierId: number;
}