import * as React from "react";
import { IEditMyApplication } from "./IEditMyApplication";
import { IEditApplicationState } from "./IEditApplicationState";
import styles from "../Myapplications.module.scss";
import { SearchBox, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { ApplicationUI } from "../application-ui/ApplicationsUI";
import { Applications } from "../../model/SPResponse";
import { Utility } from "../../helpers/Utility";
const myPinnedApplication = `My Pinned Applications`;
const allApplications = `All Applications`;
export default class EditMyApplication extends React.Component<IEditMyApplication, IEditApplicationState> {
    private _backUp: Array<Applications>;
    constructor(props: IEditMyApplication) {
        super(props);
        this.state = {
            applicationListItems: [...this.props.allapplications],
            userApplicationListItems: [...this.props.userApplicationListItems],
            loading: false,
            dragId: 0
        }
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }
    componentDidMount(): void {
        const userApps = [...this.state.userApplicationListItems];
        for (let index = 0; index < userApps.length; index++) {
            const element = userApps[index];
            element.order = element.order ?? (index+1)
        }
        this.setState({
            userApplicationListItems:userApps
        })
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
                    <input type="button" value='Cancel' onClick={() => {
                        this.props.hidePopup();
                    }} />
                </div>
            </section>
        )
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
    private SearchApplications(searchValue: string) {
        this.SearchApps(searchValue);
    }
    public SearchApps(searchValue: string) {
        if (searchValue.length > 0) {
            const apps = this.state.applicationListItems.filter(x => x.Title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            this.setState({ applicationListItems: apps });
        }
        else {
            this.setState({ applicationListItems: [...this._backUp] });
        }
    }
    public handleCheckBox(ev?: React.ChangeEvent, isChecked?: boolean) {
        console.log(ev);
        const checkboxId = ev.target.id;
        const appId = Utility.GetIdFromString(checkboxId);
        const application = this.state.applicationListItems.filter((x)=> x.Id === appId)[0];
        const UserApplication = this.state.userApplicationListItems.filter((x)=> x.Id === appId);
        if(UserApplication.length > 0 && !isChecked){
            const oldUserApps = [...this.state.userApplicationListItems];
            const newApps = [];
            for (let index = 0; index < oldUserApps.length; index++) {
                const element = oldUserApps[index];
                if(element.Id !== appId){
                    newApps.push(element);
                }
            }
            this.setState({
                userApplicationListItems: newApps
            })
        }
        else{
            const oldUserApps = [...this.state.userApplicationListItems];
            if(application.order=== undefined)
                 application.order = this.state.userApplicationListItems.length;
            const newApps = oldUserApps.concat(application);
            this.setState({
                userApplicationListItems: newApps
            });
        }
    }
    private LoadApplicationDashBoard(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
        return <div>
            <h3 className="mt-5">{myPinnedApplication}</h3>
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
            <div>
                <SearchBox onSearch={(searchValue) => { this.SearchApplications(searchValue); }}
                    onChange={
                        (_, searchValue) => { this.SearchApplications(searchValue); }
                    }></SearchBox>
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