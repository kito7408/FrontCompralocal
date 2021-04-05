import { Direction } from "./direction";

export class User{
    id: number;
    name: string;
    last_name: string;
    email: string;
    password: string;
    docType: string;
    docNum: string;
    phoneFijo: string;
    phoneMovil: string;
    userTypeId: number;
    directions: Direction[];
}