export class DeliveryZone{
    id: number;
    price: number;
    districts: string[];
    productId: number;
}

export class DeliveryZoneLocal{
    num: number;
    districtSelected: string;
    districts: string[];
    price: number;
  }