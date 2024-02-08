import { Applications } from "../model/SPResponse";

export interface IMyApplicationState {
    applicationListItems: Array<Applications>;
    allapplications: Array<Applications>;
    userApplicationListItems:Array<Applications>;
    loading:boolean;
    isPopupVisible:boolean;
    itemCount:number;
}
  