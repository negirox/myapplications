import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMyapplicationsProps {
  applicationlistName: string;
  userApplicationlistName: string;
  adminUserlistName:string;
  userMasterList:string;
  webpartContext:WebPartContext;
  dashBoardBackGroundColor:string;
  tilesBackGroundColor:string;
  showBorder:boolean;
  itemCount:number;
}
