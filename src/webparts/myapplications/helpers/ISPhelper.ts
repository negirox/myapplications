import { AdminConfigurationsResponse, ApplicationResponse, UserApplicationsResponse, UserMasterResponse } from "../model/SPResponse";

export interface ISPHelper {
    getListData(url: string):any;
    getUserMaster(props: any, email: string, noofRecords: number): Promise<UserMasterResponse>;
    getUserApplications(props: any, email: string, noofRecords: number): Promise<UserApplicationsResponse>;
    getApplications(props: any, noofRecords: number): Promise<ApplicationResponse>;
    getAdminConfiguration(props: any, noofRecords: number): Promise<AdminConfigurationsResponse>;
    saveUserApps(props:any,postObj:object):Promise<boolean>;
    putUserApps(props:any,itemId:number,postObj:object):Promise<boolean>;
}