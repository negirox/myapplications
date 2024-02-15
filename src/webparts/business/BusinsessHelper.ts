
import { ApplicatioRecords } from "../myapplications/model/ApplicationModel";
import { AdminConfiguration, AdminConfigurationsResponse, ApplicationResponse, UserApplicationsResponse, UserMasterResponse } from "../myapplications/model/SPResponse";
import { IBusinessHelper } from "./IBusinessHelper";

export class BusinessHelper implements IBusinessHelper {
    constructor() {

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
        const tempApplications: string[] = [];
        renderedApplications.forEach((x) => {
            if (RemovedApplications.indexOf(x) === -1) {
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
            adminApplications = adminConfiugrations[0].SelectedApplications.split(',');
        }
        if (userMasterData.value.length > 0) {
            const departmentApplicationsRecords = adminConfiguration.value.
                filter(x => x.Title.toUpperCase() === userMasterData.value[0].Department.toUpperCase());
            if (departmentApplicationsRecords && departmentApplicationsRecords.length > 0) {
                departmentApplications = departmentApplicationsRecords[0].SelectedApplications.split(',');
                adminApplications = adminApplications.concat(departmentApplications);
            }
        }
        return { adminApplications, departmentApplications };
    }
    private filterUniqueObjects(value: any, index: any, array: string | any[]): boolean {
        return array.indexOf(value) === index;
    }
}