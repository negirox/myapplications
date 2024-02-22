
import { ApplicatioRecords } from "../myapplications/model/ApplicationModel";
import {
    AdminConfiguration, AdminConfigurationsResponse, ApplicationResponse, Applications,
    UserApplications,
    UserApplicationsBase, UserApplicationsResponse, UserMaster, UserMasterResponse
} from "../myapplications/model/SPResponse";
import { IBusinessHelper } from "./IBusinessHelper";

export class BusinessHelper implements IBusinessHelper {
    constructor() {

    }
    public getUserPrefrenceData(userApplications: Applications[], adminApplications: AdminConfiguration[], 
        allApplications: Applications[], usermasterData:UserMaster[]): UserApplicationsBase {
        const userApps = [...userApplications];//1,5,4
        const adminApps = [...adminApplications];//2,3
        const allApps = [...allApplications];//2,3
        let Allapps:string[] =[];
        //const userSelectedApps: string[] = [];
        let userRemovedApps:string[] = [];
        const loggedInUserRecord: UserApplications = JSON.parse(localStorage.getItem('loggedInUserRecord'));
        if(loggedInUserRecord){
            userRemovedApps = userRemovedApps.concat(loggedInUserRecord.UserRemovedApplications?.split(','));
        }
        Allapps = this.GetAdminApps(adminApps, Allapps, usermasterData);
        for (let index = 0; index < allApps.length; index++) {
            const app = allApps[index];
            if(Allapps.indexOf(app.Id.toString()) > -1){
                app.IsAdminPushed = true;
                if(app.isSelected === false){
                    userRemovedApps.push(app.Id.toString());
                }
            }
            else{
                app.IsAdminPushed = false;
            }
        }
        const userAppsToShow = userApps.filter((x)=>{
            return userRemovedApps.indexOf(x.Id.toString()) === -1
        });
        const selectedAppstoRender = userAppsToShow.map(x=>x.Id.toString());
        const postObj: UserApplicationsBase = {
            ApplicationOrder: selectedAppstoRender.toString(),
            UserRemovedApplications: userRemovedApps.toString(),
            UserSelectedApplications: selectedAppstoRender.toString()
        }
        return postObj;
    }
    private GetAdminApps(adminApps: AdminConfiguration[], Allapps: string[], usermasterData: UserMaster[]) {
        if (adminApps.length > 0) {
            const allUserApps = adminApps.filter(x => x.Title.toUpperCase() === 'All Users'.toUpperCase());
            if (allUserApps.length > 0) {
                const selectedAdminApps: string[] = allUserApps[0].SelectedAppsId.toString().split(',');
                Allapps = Allapps.concat(selectedAdminApps);
            }
            if (usermasterData && usermasterData.length > 0) {
                const departMentApps = adminApps.filter(x => x.Title.toUpperCase() === usermasterData[0].UserCluster.toUpperCase());
                if (departMentApps && departMentApps.length > 0) {
                    const selectedDepartmentApps: string[] = allUserApps[0].SelectedAppsId.toString().split(',');
                    Allapps = Allapps.concat(selectedDepartmentApps);
                }
            }
        }
        return Allapps;
    }

    public getUserApplications(applications: ApplicationResponse, userApplications: UserApplicationsResponse,
        adminConfiguration: AdminConfigurationsResponse, userMasterData: UserMasterResponse,
        defaultApplicationToShow: number): ApplicatioRecords {
        let renderedApplications: string[] = [];
        let adminApplications: string[] = [];
        let departmentApplications: string[] = [];
        if (adminConfiguration.value.length > 0) {
            ({ adminApplications, departmentApplications } = this._getAdminandDepartmentApplications(adminConfiguration, adminApplications, userMasterData, departmentApplications));
        }
        renderedApplications = renderedApplications.concat(adminApplications);
        let orders: string[] = [];
        //remove applications
        if (userApplications.value && userApplications.value.length > 0) {
            localStorage.setItem('loggedInUserRecord', JSON.stringify(userApplications.value[0]));
            renderedApplications = this._getUserApplications(userApplications, renderedApplications);
            orders = userApplications.value[0].ApplicationOrder?.split(',');
        }
        let userApplicationsToRender = applications.value.filter((a) => {
            return renderedApplications.indexOf(a.Id.toString()) !== -1;
        });
        userApplicationsToRender = userApplicationsToRender.filter(this.filterUniqueObjects);
        if (orders !== undefined) {
            for (let index = 0; index < orders.length; index++) {
                const orderNo = orders[index];
                if(userApplicationsToRender[index])
                    userApplicationsToRender[index].order = parseInt(orderNo) ?? (index + 1);
            }
        }
        const applicationsToShow = applications.value.slice(0, defaultApplicationToShow);

        const response: ApplicatioRecords = {
            allApplications: applications.value,
            applicationsToShow: applicationsToShow,
            userApplicationsToRender: userApplicationsToRender
        }
        return response;

    }



    private _getUserApplications(userApplications: UserApplicationsResponse, renderedApplications: string[]): string[] {
        const Userapplications = userApplications.value[0].UserSelectedApplications?.split(',');
        const RemovedApplications = userApplications.value[0].UserRemovedApplications?.split(',');
        renderedApplications = renderedApplications.concat(Userapplications);
        const tempApplications: string[] = RemovedApplications === undefined ? renderedApplications : [];
        renderedApplications.forEach((x) => {
            if (RemovedApplications && RemovedApplications.indexOf(x) === -1) {
                tempApplications.push(x);
            }
        });
        return tempApplications;
    }

    private _getAdminandDepartmentApplications(adminConfiguration: AdminConfigurationsResponse,
        adminApplications: string[], userMasterData: UserMasterResponse, departmentApplications: string[])
        : { adminApplications: string[], departmentApplications: string[] } {
        const adminConfiugrations: AdminConfiguration[] = adminConfiguration.value.filter(x => x.Title.toUpperCase() === 'All Users'.toUpperCase());
        if (adminConfiugrations && adminConfiugrations.length > 0) {
            adminApplications = adminConfiugrations[0].SelectedAppsId.toString().split(',');
        }
        if (userMasterData.value.length > 0) {
            const departmentApplicationsRecords = adminConfiguration.value.
                filter(x => x.Title.toUpperCase() === userMasterData.value[0].UserCluster.toUpperCase());
            if (departmentApplicationsRecords && departmentApplicationsRecords.length > 0) {
                departmentApplications = departmentApplicationsRecords[0].SelectedAppsId.toString().split(',');
                adminApplications = adminApplications.concat(departmentApplications);
            }
        }
        return { adminApplications, departmentApplications };
    }
    private filterUniqueObjects(value: any, index: any, array: string | any[]): boolean {
        return array.indexOf(value) === index;
    }
}