
import { ApplicatioRecords } from "../myapplications/model/ApplicationModel";
import { AdminConfiguration, AdminConfigurationsResponse, ApplicationResponse, Applications, 
    UserApplicationsBase, UserApplicationsResponse, UserMaster, UserMasterResponse } from "../myapplications/model/SPResponse";

export interface IBusinessHelper{
    getUserApplications(applications: ApplicationResponse, userApplications: UserApplicationsResponse,
        adminConfiguration: AdminConfigurationsResponse,userMasterData:UserMasterResponse,
        defaultApplicationToShow:number):ApplicatioRecords;
    getUserPrefrenceData(userApplications:Applications[],adminApplications:AdminConfiguration[],
        allApplications: Applications[],  usermasterData:UserMaster[] ):UserApplicationsBase;
}