import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Applications } from "../../model/SPResponse";

export interface IEditMyApplication
{
    webPartContext:WebPartContext
    hidePopup:()=>void;
    applicationlistName?: string;
    userApplicationlistName?: string;
    allapplications: Array<Applications>;
    userApplicationListItems:Array<Applications>;
    dashBoardBackGroundColor?:string;
}