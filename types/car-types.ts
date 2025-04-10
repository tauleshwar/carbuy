export default interface Car {
    id: string;
    brand: string;
    fuel_type: string;
    price: number;
    image: string;
    title: string;
    seating_capacity:number;
}

export interface Brand {
    id: string;
    name: string;
    image: string;
}