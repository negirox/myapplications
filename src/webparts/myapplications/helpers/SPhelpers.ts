import {
    SPHttpClient, SPHttpClientResponse
} from '@microsoft/sp-http';
import { AdminConfigurationsResponse, ApplicationResponse, UserApplicationsResponse, UserMasterResponse } from '../model/SPResponse';
import { ISPHelper } from './ISPhelper';
import { postheaders, putHeaders } from '../model/SPConstants';

export class SPHelpers implements ISPHelper {
    private _client: SPHttpClient;
    private _clientConfig = SPHttpClient.configurations.v1;
    constructor(client: SPHttpClient) {
        this._client = client;
    }
    public async putUserApps(props: any, itemId: number, postObj: Object): Promise<boolean> {
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.userApplicationlistName}')/Items(${itemId})`;
        const response = await this.putListData(ConfigUrl, JSON.stringify(postObj));
        console.log(response);
        return response.ok ? true :false;
    }
    public async saveUserApps(props: any, postObj: Object): Promise<boolean> {
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.userApplicationlistName}')/Items`;
        const response = await this.setListData(ConfigUrl, JSON.stringify(postObj));
        console.log(response);
        return response.ok ? true :false;
    }
    public async getListData(url: string) {
        const response = await this._client.get(url, this._clientConfig);
        return await response.json();
    }
    public async setListData(url: string, postData: string): Promise<SPHttpClientResponse> {
        const headers = { ...postheaders }
        headers.body = postData;
        const response = await this._client.post(url, this._clientConfig, headers);
        return response;
    }
    public async putListData(url: string, postData: string): Promise<SPHttpClientResponse> {
        const headers = { ...putHeaders }
        headers.body = postData;
        const response = await this._client.post(url, this._clientConfig, headers);
        return response;
    }
    public async getUserMaster(props: any, email: string, noofRecords: number): Promise<UserMasterResponse> {
        const { filterCondition, selectedColumns, records, orderByColumn } = this._getUserMasterConfigurations(noofRecords, email);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.userMasterList}')/Items?$filter=${filterCondition}&$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
        return await this.getListData(ConfigUrl);
    }
    public async getUserApplications(props: any, email: string, noofRecords: number): Promise<UserApplicationsResponse> {
        const { filterCondition, selectedColumns, records, orderByColumn } = this._getUserConfigurations(noofRecords, email);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.userApplicationlistName}')/Items?$filter=${filterCondition}&$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
        return await this.getListData(ConfigUrl);
    }
    public async getApplications(props: any, noofRecords: number): Promise<ApplicationResponse> {
        const { filterCondition, selectedColumns, records, orderByColumn } = this._getConfigForApplications(noofRecords);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.applicationlistName}')/Items?$filter=${filterCondition}&$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
        return await this.getListData(ConfigUrl);
    }
    public async getAdminConfiguration(props: any, noofRecords: number): Promise<AdminConfigurationsResponse> {
        const { selectedColumns, records, orderByColumn } = this._getAdminConfigurations(noofRecords);
        const ConfigUrl = `${props.webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${props.adminUserlistName}')/Items?$select=${selectedColumns}${records}&$orderby=${orderByColumn}`;
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
        const selectedColumns = `Title,Id,*`;
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