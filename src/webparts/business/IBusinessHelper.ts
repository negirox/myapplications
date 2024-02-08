
import { ApplicatioRecords } from "../myapplications/model/ApplicationModel";
import { AdminConfigurationsResponse, ApplicationResponse, UserApplicationsResponse, UserMasterResponse } from "../myapplications/model/SPResponse";

export interface IBusinessHelper{
    getUserApplications(applications: ApplicationResponse, userApplications: UserApplicationsResponse,
        adminConfiguration: AdminConfigurationsResponse,userMasterData:UserMasterResponse,
        defaultApplicationToShow:number):ApplicatioRecords;
}