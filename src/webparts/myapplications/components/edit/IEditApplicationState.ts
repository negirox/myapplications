import { Applications, UserApplications } from "../../model/SPResponse";

export interface IEditApplicationState {
    listItems: Array<Applications>;
    userItems:Array<UserApplications>;
    loading:boolean;
}
  