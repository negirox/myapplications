import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Applications } from "../../model/SPResponse";
import { ISPHelper } from "../../helpers/ISPhelper";

export interface IEditMyApplication
{
    webpartContext:WebPartContext
    hidePopup:()=>void;
    loadorRefresh:(userApplications:Applications[])=>void;
    applicationlistName?: string;
    userApplicationlistName?: string;
    allapplications: Array<Applications>;
    userApplicationListItems:Array<Applications>;
    dashBoardBackGroundColor?:string;
    spHelper:ISPHelper;
    adminUserlistName:string;
    userMasterList:string;
}