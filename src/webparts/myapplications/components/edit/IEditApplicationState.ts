import { Applications } from "../../model/SPResponse";

export interface IEditApplicationState {
    applicationListItems: Array<Applications>;
    userApplicationListItems:Array<Applications>;
    loading:boolean;
}