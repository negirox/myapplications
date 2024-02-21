import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  //PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'MyapplicationsWebPartStrings';
import Myapplications from './components/Myapplications';
import { IMyapplicationsProps } from './components/IMyapplicationsProps';
import { ListNames } from './model/SPConstants';
import { IODataList } from '@microsoft/sp-odata-types';
import {
  SPHttpClient
} from '@microsoft/sp-http';
//import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

export interface IMyapplicationsWebPartProps {
  applicationlistName: string;
  userApplicationlistName: string;
  adminUserlistName: string;
  userMasterList: string;
  dashBoardBackGroundColor: string;
  tilesBackGroundColor: string;
  showBorder: boolean;
  itemCount: number;
}

export default class MyapplicationsWebPart extends BaseClientSideWebPart<IMyapplicationsWebPartProps> {
  dropdownOptions: IPropertyPaneDropdownOption[];
  public render(): void {
    const element: React.ReactElement<IMyapplicationsProps> = React.createElement(
      Myapplications,
      {
        applicationlistName: this.properties.applicationlistName ?? ListNames.Applications,
        userApplicationlistName: this.properties.userApplicationlistName ?? ListNames.UserApplications,
        adminUserlistName: this.properties.adminUserlistName ?? ListNames.AdminConfiguration,
        userMasterList: this.properties.userMasterList ?? ListNames.UserMaster,
        webpartContext: this.context,
        dashBoardBackGroundColor: this.properties.dashBoardBackGroundColor ?? '#fff',
        tilesBackGroundColor: this.properties.tilesBackGroundColor ?? '#fff',
        showBorder: this.properties.showBorder ?? false,
        itemCount:this.properties.itemCount ?? 8
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    const options = await this.fetchOptions();
    this.dropdownOptions = options;
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  private async fetchLists(url: string): Promise<any> {
    const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
    if (response.ok) {
      return response.json();
    } else {
      console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
      return null;
    }
  }
  private async fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$select=Title,Id&$filter=Hidden eq false`;
    const response = await this.fetchLists(url);
    var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
    response.value.map((list: IODataList) => {
      options.push({ key: list.Title, text: list.Title });
    });
    return options;
  }
  protected onPropertyPaneConfigurationStart(): void {

  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (newValue) {
      switch (propertyPath) {
        case 'applicationlistName': this.properties.applicationlistName = newValue; break;
        case 'userApplicationlistName': this.properties.userApplicationlistName = newValue; break;
        case 'adminUserlistName': this.properties.adminUserlistName = newValue; break;
        case 'userMasterList': this.properties.userMasterList = newValue; break;
        case 'itemCount': this.properties.itemCount = parseInt(newValue); break;
      }
      // push new list value
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();
      // re-render the web part as clearing the loading indicator removes the web part body
      this.render();
    }
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('applicationlistName', {
                  label: 'Select Application list',
                  options: [...this.dropdownOptions]
                }),
                PropertyPaneDropdown('userApplicationlistName', {
                  label: 'Select User Application list',
                  options: [...this.dropdownOptions]
                }),
                PropertyPaneDropdown('adminUserlistName', {
                  label: 'Select Admin Configuration list',
                  options: [...this.dropdownOptions]
                }),
                PropertyPaneDropdown('userMasterList', {
                  label: 'Select User Master list',
                  options: [...this.dropdownOptions]
                }),
/*                 PropertyPaneTextField('applicationlistName', {
                  label: 'Enter Application ListName'
                }),
                PropertyPaneTextField('userApplicationlistName', {
                  label: 'Enter User Application ListName'
                }),
                PropertyPaneTextField('adminUserlistName', {
                  label: 'Enter Admin ListName'
                }),
                PropertyPaneTextField('userMasterList', {
                  label: 'Enter User Master ListName'
                }), */
                PropertyPaneTextField('itemCount', {
                  label: 'Enter item Count to Show',
                  placeholder: '8',
                  value: '8'
                }),
                /*  PropertyPaneTextField('dashBoardBackGroundColor', {
                   label: 'Enter Dashboard background color #fff'
                 }),
                 PropertyPaneTextField('tilesBackGroundColor', {
                   label: 'Enter Tiles BackGround color #fff'
                 }),
                 PropertyPaneToggle('showBorder',{
                   onText:'Hide Border',
                   offText : 'Show Border'
                 }) */
              ]
            }
          ]
        }
      ]
    };
  }
}
