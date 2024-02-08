import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEditMyApplication
{
    webPartContext:WebPartContext
    hidePopup:()=>void;
    applicationlistName?: string;
    userApplicationlistName?: string;
}