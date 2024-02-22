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
import { ISPHelper } from './helpers/ISPhelper';
import { SPHelpers } from './helpers/SPhelpers';
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
  imgURL: string;
  bannerTitle: string;
  bannerDescription: string;
}

export default class MyapplicationsWebPart extends BaseClientSideWebPart<IMyapplicationsWebPartProps> {
  private dropdownOptions: IPropertyPaneDropdownOption[];
  private spHelper:ISPHelper;
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
        itemCount:this.properties.itemCount ?? 8,
        imgURL:this.properties.imgURL ?? this.previewImageUrl,
        bannerTitle: this.properties.bannerTitle ?? 'Welcome',
        bannerDescription: this.properties.bannerDescription ?? 'Hello',
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this.spHelper = new SPHelpers(this.context.spHttpClient);
    const options = await this.fetchOptions();
    this.dropdownOptions = options;
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  private async fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$select=Title,Id&$filter=Hidden eq false`;
    const response = await this.spHelper.getListData(url);
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
      //  case 'itemCount': this.properties.itemCount = parseInt(newValue); break;
        //case 'imgURL': this.properties.imgURL = newValue; break;
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
                PropertyPaneTextField('imgURL', {
                  label: 'Enter Image Url'
                }),
                PropertyPaneTextField('bannerTitle', {
                  label: 'Enter Title'
                }),
                PropertyPaneTextField('bannerDescription', {
                  label: 'Enter Description'
                }),
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
