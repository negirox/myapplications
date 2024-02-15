import {
    SPHttpClient
  } from '@microsoft/sp-http';
import { AdminConfigurationsResponse, ApplicationResponse, UserApplicationsResponse, UserMasterResponse } from '../model/SPResponse';
import { ISPHelper } from './ISPhelper';

export class SPHelpers implements ISPHelper {
    private _client :SPHttpClient;
    private _clientConfig = SPHttpClient.configurations.v1
    constructor(client:SPHttpClient){
        this._client = client;
    }
    public async getListData(url:string){
       const response = await this._client.get(url,this._clientConfig);
       return await response.json();
    }
    public async getUserMaster(props:any,email:string,noofRecords:number): Promise<UserMasterResponse> {
        const { filterCondition, selectedColumns, records, orderByColumn } = this._getUserMasterConfigurations(noofRecords, email);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.userMasterList}')/Items?$filter=${filterCondition}&$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
        return await this.getListData(ConfigUrl);
    }
    public async getUserApplications(props:any,email:string,noofRecords:number): Promise<UserApplicationsResponse> {
        const { filterCondition, selectedColumns, records, orderByColumn } = this._getUserConfigurations(noofRecords, email);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.userApplicationlistName}')/Items?$filter=${filterCondition}&$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
        return await this.getListData(ConfigUrl);
    }
    public async getApplications(props:any,noofRecords:number): Promise<ApplicationResponse> {
        const { filterCondition, selectedColumns, records, orderByColumn } = this._getConfigForApplications(noofRecords);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.applicationlistName}')/Items?$filter=${filterCondition}&$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
        return await this.getListData(ConfigUrl);
    }
    public async getAdminConfiguration(props:any,noofRecords:number): Promise<AdminConfigurationsResponse> {
        const { selectedColumns, records, orderByColumn } = this._getAdminConfigurations(noofRecords);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.adminUserlistName}')/Items?$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
        console.log(ConfigUrl);
        return await this.getListData(ConfigUrl);
    }
    private _getUserConfigurations(noofRecords: number, email: string) {
        const records = `&$top=${noofRecords}`;
        const selectedColumns = `Title,Id,UserSelectedApplications,UserRemovedApplications,ApplicationOrder`;
        const filterColumn = 'Title';
        const filterType = 'eq';
        const filterValue = email;
        const filterCondition = `${filterColumn} ${filterType} '${filterValue}'`;
        const orderByColumn = `Id desc`;
        return { filterCondition, selectedColumns, records, orderByColumn };
    }
    private _getConfigForApplications(noofRecords: number) {
        const records = `&$top=${noofRecords}`;
        const selectedColumns = `Title,Id,IconURL,IsVisibleOnPage`;
        const filterType = 'eq';
        const filterColumn = 'IsVisibleOnPage';
        const filterValue = 1;
        const filterCondition = `${filterColumn} ${filterType} ${filterValue}`;
        const orderByColumn = `Id desc`;
        return { filterCondition, selectedColumns, records, orderByColumn };
    }
    private _getAdminConfigurations(noofRecords: number) {
        const records = `&$top=${noofRecords}`;
        const selectedColumns = `Title,Id,SelectedApplications`;
/*         const filterColumn = 'Title';
        const filterType = 'eq';
        const filterValue = 'Admin';
        const filterCondition = `$filter=${filterColumn} ${filterType} '${filterValue}'`; */
        const orderByColumn = `Id desc`;
        return { selectedColumns, records, orderByColumn };
    }
    private _getUserMasterConfigurations(noofRecords: number, email: string) {
        const records = `&$top=${noofRecords}`;
        const selectedColumns = `Title,Id,Department`;
        const filterColumn = 'Title';
        const filterType = 'eq';
        const filterValue = email;
        const filterCondition = `${filterColumn} ${filterType} '${filterValue}'`;
        const orderByColumn = `Id desc`;
        return { filterCondition, selectedColumns, records, orderByColumn };
    }

}