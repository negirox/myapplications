import * as React from "react";
import { IEditMyApplication } from "./IEditMyApplication";
import { IEditApplicationState } from "./IEditApplicationState";
import styles from "../Myapplications.module.scss";
import { PrimaryButton, SearchBox, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { ApplicationUI } from "../application-ui/ApplicationsUI";
import { AdminConfiguration, AdminConfigurationsResponse, Applications, UserApplications, UserApplicationsBase, UserMasterResponse } from "../../model/SPResponse";
import { Utility } from "../../helpers/Utility";
import { SPHelpers } from "../../helpers/SPhelpers";
import { BusinessHelper } from "../../../business/BusinsessHelper";
import { ISPHelper } from "../../helpers/ISPhelper";
import * as toastr from "toastr";
import "toastr/build/toastr.min.css";
import { IBusinessHelper } from "../../../business/IBusinessHelper";
/* import {
    SPHttpClient
} from '@microsoft/sp-http'; */
//import { ToastrSettings } from "../../model/SPConstants";
const myPinnedApplication = `My Pinned Applications`;
const allApplications = `All Applications`;
toastr.options.hideDuration = 3000;
toastr.options.timeOut = 3000;
export default class EditMyApplication extends React.Component<IEditMyApplication, IEditApplicationState> {
    private _backUp: Array<Applications>;
    private _spHelper: ISPHelper;
    private _adminApplications: AdminConfiguration[];
    private _bussinessHelper: IBusinessHelper;
    private _userMasterdata: UserMasterResponse;
    constructor(props: IEditMyApplication) {
        super(props);
        this.state = {
            applicationListItems: [...this.props.allapplications],
            userApplicationListItems: [...this.props.userApplicationListItems],
            loading: false,
            dragId: 0
        }
        this._spHelper = new SPHelpers(this.props.webpartContext.spHttpClient);
        this._bussinessHelper = new BusinessHelper();
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.SaveUI = this.SaveUI.bind(this);
    }
    async componentDidMount(): Promise<void> {
        const userApps = [...this.state.userApplicationListItems];
        for (let index = 0; index < userApps.length; index++) {
            const element = userApps[index];
            element.order = element.order ?? (index + 1)
            this.SetSelectedApps(element);
        }
        this.setState({
            userApplicationListItems: userApps
        });
        this._backUp = [...this.state.applicationListItems];
        const adminApplications: AdminConfigurationsResponse = await this._spHelper.getAdminConfiguration(this.props, 4999);
        const userMasterData = await this._spHelper.getUserMaster(this.props, this.props.webpartContext.pageContext.user.email, 1);
        this._adminApplications = adminApplications.value;
        this._userMasterdata = userMasterData;
    }
    public render(): React.ReactElement<IEditMyApplication> {
        return (
            <section>
                <div>
                    <div className={styles.container} style={{
                    }}>
                        <div>
                            {this.LoadApplicationDashBoard(myPinnedApplication)}
                        </div>
                        <div>
                            {this.LoadApplicationDashBoardWithSearchBar(allApplications)}
                        </div>
                    </div>
                    <div>
                        <PrimaryButton onClick={this.SaveUI} className={styles.SaveAppButton}>
                            Save
                        </PrimaryButton>
                    </div>
                </div>
            </section>
        )
    }
    public async SaveUI():Promise<void> {
        const loggedInUserRecord: UserApplications = JSON.parse(localStorage.getItem('loggedInUserRecord'));
        const postObj: UserApplicationsBase = this._bussinessHelper.getUserPrefrenceData(this.state.userApplicationListItems,
            this._adminApplications, this.state.applicationListItems, this._userMasterdata.value);
        if (loggedInUserRecord) {
            loggedInUserRecord.ApplicationOrder = this.state.userApplicationListItems.map(x => x.Id).toString();
            /*   {
                 "ApplicationOrder": loggedInUserRecord.ApplicationOrder,
                 "UserSelectedApplications": loggedInUserRecord.ApplicationOrder
             }; */
            const response = await this._spHelper.putUserApps(this.props, loggedInUserRecord.Id, postObj);
            if(response){
                this.props.hidePopup();
                toastr.success("User prefrence saved successfully.");
                this.props.loadorRefresh();
            }
            else{
                this.props.hidePopup();
                toastr.error("Something went wrong.");
            }
        }
        else {
            //create record
            postObj.Title = this.props.webpartContext.pageContext.user.email;
            const response = await this._spHelper.saveUserApps(this.props,postObj);
            if(response){
                this.props.hidePopup();
                toastr.success("User prefrence saved successfully.");
                this.props.loadorRefresh();
            }
            else{
                this.props.hidePopup();
                toastr.error("Something went wrong.");
            }
        }
    }
    public handleDrag(ev: any): void {
        this.setState({ dragId: parseInt(ev.currentTarget.id) });
    };
    public handleDrop(ev: any): void {
        const boxes = [...this.state.userApplicationListItems];
        const dragBox = boxes.filter((box) => box.Id === this.state.dragId)[0];
        const dropBox = boxes.filter((box) => box.Id === parseInt(ev.currentTarget.id))[0];
        if (dragBox.order && dropBox.order) {
            const dragBoxOrder = dragBox.order;
            const dropBoxOrder = dropBox.order;
            const dragId = this.state.dragId;
            const newBoxState = boxes.map((box) => {
                if (box.Id === dragId) {
                    box.order = dropBoxOrder;
                }
                if (box.Id === parseInt(ev.currentTarget.id)) {
                    box.order = dragBoxOrder;
                }
                return box;
            });

            this.setState({ userApplicationListItems: newBoxState });
        }
    };
    private SearchApplications(searchValue: string):void {
        this.SearchApps(searchValue);
    }
    public SearchApps(searchValue: string):void {
        if (searchValue.length > 0) {
            const apps = this.state.applicationListItems.filter(x => x.Title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            this.setState({ applicationListItems: apps });
        }
        else {
            this.setState({ applicationListItems: [...this._backUp] });
        }
    }
    public handleCheckBox(ev?: React.ChangeEvent, isChecked?: boolean):void {
        const checkboxId = ev.target.id;
        const appId = Utility.GetIdFromString(checkboxId);
        const application = this._backUp.filter((x) => x.Id === appId)[0];
        const UserApplication = this.state.userApplicationListItems.filter((x) => x.Id === appId);
        const newApps = [];
        const newApplications: Applications[] = [...this._backUp];
        if (UserApplication.length > 0) {
            if (isChecked) {
                const oldUserApps = [...this.state.userApplicationListItems];
                if (application.order === undefined) {
                    application.order = this.state.userApplicationListItems.length;
                }
                const selectedApps = newApplications.filter(x => x.Id.toString() === application.Id.toString());
                if (selectedApps.length > 0) {
                    selectedApps[0].isSelected = isChecked;
                    application.isSelected = isChecked;
                }
                else {
                    selectedApps[0].isSelected = !isChecked;
                    application.isSelected = !isChecked;
                }
                const newApps = oldUserApps.concat(application);
                this.setState({
                    userApplicationListItems: newApps,
                    applicationListItems: newApplications
                });
            }
            else {
                const oldUserApps = [...this.state.userApplicationListItems];
                for (let index = 0; index < oldUserApps.length; index++) {
                    const element = oldUserApps[index];
                    if (element.Id !== appId) {
                        newApps.push(element);
                    }
                    if (element.Id === appId) {
                        const selectedApps = newApplications.filter(x => x.Id.toString() === element.Id.toString());
                        if (selectedApps.length > 0) {
                            selectedApps[0].isSelected = isChecked;
                            element.isSelected = isChecked;
                        }
                    }
                }
                this.setState({
                    userApplicationListItems: newApps,
                    applicationListItems: newApplications
                })
            }

        }
        else {
            if (isChecked) {
                const oldUserApps = [...this.state.userApplicationListItems];
                if (application.order === undefined) {
                    application.order = this.state.userApplicationListItems.length;
                }
                const selectedApps = newApplications.filter(x => x.Id.toString() === application.Id.toString());
                if (selectedApps.length > 0) {
                    selectedApps[0].isSelected = isChecked;
                    application.isSelected = isChecked;
                }
                else {
                    selectedApps[0].isSelected = !isChecked;
                    application.isSelected = !isChecked;
                }
                const newApps = oldUserApps.concat(application);
                this.setState({
                    userApplicationListItems: newApps,
                    applicationListItems: newApplications
                });
            }
            else {
                const oldUserApps = [...this.state.userApplicationListItems];
                for (let index = 0; index < oldUserApps.length; index++) {
                    const element = oldUserApps[index];
                    if (element.Id !== appId) {
                        newApps.push(element);
                    }
                    if (element.Id === appId) {
                        const selectedApps = newApplications.filter(x => x.Id.toString() === element.Id.toString());
                        if (selectedApps.length > 0) {
                            selectedApps[0].isSelected = isChecked;
                            element.isSelected = isChecked;
                        }
                    }
                }
                this.setState({
                    userApplicationListItems: newApps,
                    applicationListItems: newApplications
                })
            }

            /*  const oldUserApps = [...this.state.userApplicationListItems];
             if (application.order === undefined) {
                 application.order = this.state.userApplicationListItems.length;
             }
             const selectedApps = newApplications.filter(x => x.Id.toString() === application.Id.toString());
             if (selectedApps.length > 0) {
                 selectedApps[0].isSelected = isChecked;
                 application.isSelected = isChecked;
             }
             else {
                 selectedApps[0].isSelected = !isChecked;
                 application.isSelected = !isChecked;
             }
             const newApps = oldUserApps.concat(application);
             this.setState({
                 userApplicationListItems: newApps,
                 applicationListItems: newApplications
             }); */
        }
    }
    private SetSelectedApps(element: Applications):void {
        const selectedApps = this.state.applicationListItems.filter(x => x.Id.toString() === element.Id.toString());
        if (selectedApps.length > 0) {
            selectedApps[0].isSelected = true;
            element.isSelected = true;
        }
        else {
            selectedApps[0].isSelected = false;
            element.isSelected = false;
        }
    }
    private LoadApplicationDashBoard(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
        return <div>
            <h3 className="mt-5">{myPinnedApplication}</h3>
            <span>Drag and drop to reorder</span>
            <div className={styles.tileContainer}>
                {this.state.loading &&
                    <Spinner label={`Loading User Applications ...`} size={SpinnerSize.large} />}
                {!this.state.loading && this.state.userApplicationListItems
                    .sort((a, b) => a.order - b.order)
                    .map(x => {
                        return (
                            ApplicationUI.renderTilesDragDrop(x, this.props.dashBoardBackGroundColor,
                                this.handleDrag, this.handleDrop)
                        );
                    })}
            </div>
        </div>;
    }
    private LoadApplicationDashBoardWithSearchBar(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
        return <div>
            <h3 className="mt-5">{myPinnedApplication}</h3>
            <span>Select to pin a applications</span>
            <div className={styles.searchContainer}>
                <SearchBox onSearch={(searchValue) => { this.SearchApplications(searchValue); }}
                    onChange={
                        (_, searchValue) => { this.SearchApplications(searchValue); }
                    } className={styles.searchBox} />
            </div>
            <div className={styles.tileContainer}>
                {this.state.loading &&
                    <Spinner label={`Loading Applications ...`} size={SpinnerSize.large} />}
                {!this.state.loading && this.state.applicationListItems.map(x => {
                    return (
                        ApplicationUI.renderTilesWithCheckBox(x, '#fff', this.handleCheckBox)
                    );
                })}
            </div>
        </div>;
    }
}