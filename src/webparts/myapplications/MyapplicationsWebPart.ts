import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'MyapplicationsWebPartStrings';
import Myapplications from './components/Myapplications';
import { IMyapplicationsProps } from './components/IMyapplicationsProps';
import { ListNames } from './model/SPConstants';

export interface IMyapplicationsWebPartProps {
  applicationlistName: string;
  userApplicationlistName: string;
  adminUserlistName:string;
  userMasterList:string;
  dashBoardBackGroundColor:string;
  tilesBackGroundColor:string;
  showBorder:boolean;
}

export default class MyapplicationsWebPart extends BaseClientSideWebPart<IMyapplicationsWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IMyapplicationsProps> = React.createElement(
      Myapplications,
      {
        applicationlistName: this.properties.applicationlistName ?? ListNames.Applications,
        userApplicationlistName: this.properties.userApplicationlistName ?? ListNames.UserApplications,
        adminUserlistName : this.properties.adminUserlistName ?? ListNames.AdminConfiguration,
        userMasterList : this.properties.userMasterList ?? ListNames.UserMaster,
        webpartContext:this.context,
        dashBoardBackGroundColor:this.properties.dashBoardBackGroundColor ?? '#fff',
        tilesBackGroundColor: this.properties.tilesBackGroundColor ?? '#fff',
        showBorder:this.properties.showBorder ?? false
      }
    );

    ReactDom.render(element, this.domElement);
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
                PropertyPaneTextField('applicationlistName', {
                  label: 'Enter Application ListName'
                }),
                PropertyPaneTextField('userApplicationlistName', {
                  label: 'Enter User Application ListName'
                }),
                PropertyPaneTextField('adminUserlistName', {
                  label: 'Enter User Admin ListName'
                }),
                PropertyPaneTextField('userMasterList', {
                  label: 'Enter User Master ListName'
                }),
                PropertyPaneTextField('dashBoardBackGroundColor', {
                  label: 'Enter Dashboard background color #fff'
                }),
                PropertyPaneTextField('tilesBackGroundColor', {
                  label: 'Enter Tiles BackGround color #fff'
                }),
                PropertyPaneToggle('showBorder',{
                  onText:'Hide Border',
                  offText : 'Show Border'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
