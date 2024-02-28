import * as React from 'react';
import styles from './Myapplications.module.scss';
import { IMyapplicationsProps } from './IMyapplicationsProps';
import { IMyApplicationState } from './IMyApplicationState';
import { Applications, ApplicationResponse, UserApplicationsResponse, AdminConfigurationsResponse, UserMasterResponse } from '../model/SPResponse';
import { DefaultButton, FocusTrapZone, Layer, Popup, SearchBox, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import EditMyApplication from './edit/EditMyApplications';
import { popupStyles } from '../model/SPConstants';
import { SPHelpers } from '../helpers/SPhelpers';
import { ISPHelper } from '../helpers/ISPhelper';
import { IBusinessHelper } from '../../business/IBusinessHelper';
import { BusinessHelper } from '../../business/BusinsessHelper';
import { ApplicatioRecords } from '../model/ApplicationModel';
import { ApplicationUI } from './application-ui/ApplicationsUI';
import { Utility } from '../helpers/Utility';
let defaultApplicationToShow = 4;
export default class Myapplications extends React.Component<IMyapplicationsProps, IMyApplicationState> {
  private _spHelper: ISPHelper;
  private _bussinessHelper: IBusinessHelper;
  private _backUp: Array<Applications>;
  private _backUpApps: ApplicationResponse;
  private dynamicId: string;
  constructor(props: IMyapplicationsProps) {
    super(props);
    defaultApplicationToShow = this.props.itemCount;
    this.state = {
      applicationListItems: new Array<Applications>(),
      allapplications: new Array<Applications>(),
      userApplicationListItems: new Array<Applications>(),
      loading: true,
      isPopupVisible: false,
      itemCount: defaultApplicationToShow
    }
    this._backUp = new Array<Applications>();
    this.dynamicId = `ImageFullWidthContainer-` + Utility.GetUniqueId();
    this._spHelper = new SPHelpers(this.props.webpartContext.spHttpClient);
    this._bussinessHelper = new BusinessHelper();
    this.hidePopup = this.hidePopup.bind(this);
    this._getUserApplications = this._getUserApplications.bind(this);
    this.loadMoreApplications = this.loadMoreApplications.bind(this);
    this.SearchApplications = this.SearchApplications.bind(this);
  }
  async componentDidMount(): Promise<void> {
    const Allapplications = await this._spHelper.getApplications(this.props, 4999);
    this._backUpApps = Allapplications;
    await this.LoadorRefreshApps(Allapplications);
    this._backUp = [...this.state.applicationListItems];
    console.log(this.dynamicId);
    //setInterval(this.GetItems, 5000);
  }
  public async LoadorRefreshApps(Allapplications: ApplicationResponse):Promise<void> {
    const userMasterData = await this._spHelper.getUserMaster(this.props, this.props.webpartContext.pageContext.user.email, 1);
    const userApplications = await this._getUserApplications(1);
    const adminApplications = await this._spHelper.getAdminConfiguration(this.props, 4999);
    this.RenderUserApplications(Allapplications, userApplications, adminApplications, userMasterData);
  }

  private async _getUserApplications(noofRecords: number): Promise<UserApplicationsResponse> {
    const filterValue = this.props.webpartContext.pageContext.user.email;
    return await this._spHelper.getUserApplications(this.props, filterValue, noofRecords);
  }
  private RenderUserApplications(applications: ApplicationResponse, userApplications: UserApplicationsResponse,
    adminConfiguration: AdminConfigurationsResponse, userMasterData: UserMasterResponse):void {
    const response: ApplicatioRecords = this._bussinessHelper.getUserApplications(applications,
      userApplications, adminConfiguration, userMasterData, defaultApplicationToShow);
    this.setState({
      userApplicationListItems: response.userApplicationsToRender,
      applicationListItems: response.applicationsToShow,
      allapplications: response.allApplications,
      loading: false
    });
  }
  public hidePopup(): void {
    this.setState({
      isPopupVisible: false
    });
  }
  private async loadMoreApplications(): Promise<void> {
    const newCount = this.state.itemCount + defaultApplicationToShow;
    const applications = this.state.allapplications.slice(0, newCount);
    this._backUp = [...this.state.applicationListItems];
    this.setState({
      applicationListItems: applications,
      itemCount:newCount,
      loading: false
    });
  }
  private SearchApplications(searchValue: string):void {
    this.SearchApps(searchValue);
  }
  private SearchApps(searchValue: string):void {
    if (searchValue.length > 0) {
      const apps = this.state.allapplications.filter(x => x.Title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
      this.setState({ applicationListItems: apps });
    }
    else {
      this.setState({ applicationListItems: [...this._backUp] });
    }
  }

  public render(): React.ReactElement<IMyapplicationsProps> {
    const myPinnedApplication = `My Pinned Applications`;
    const allApplications = `All Applications`;
    return (
      <section>
        <div>
          <div className={styles.banner} id={this.dynamicId} style={{backgroundImage:`url('${this.props.imgURL}')`}}>
            <h2 className={styles.bannerTitle}>{this.props.bannerTitle}</h2>
            <p className={styles.bannerDescription}>{this.props.bannerDescription}</p>
            <DefaultButton onClick={() => {
              this.setState({ isPopupVisible: true });
            }}>
              + Pin an Application
            </DefaultButton>
          </div>
        </div>
        <div className={styles.container} style={{
          backgroundColor: this.props.dashBoardBackGroundColor,
          border: this.props.showBorder === true ? '1px solid #ccc' : 'none'
        }}>
          <div>
            {this.LoadApplicationDashBoard(myPinnedApplication)}
          </div>
          <div>
            {this.LoadApplicationDashBoardWithSearchBar(allApplications)}
          </div>
        </div>
        <div>
          <Layer>
            {this.state.isPopupVisible && <Popup
              className={popupStyles.root}
              role="dialog"
              aria-modal="true"
            >
              <FocusTrapZone>
                <div className={popupStyles.content}>
                  <div>
                    <span onClick={this.hidePopup} className={styles.closeButton}>X</span>
                  </div>
                  <EditMyApplication
                    webpartContext={this.props.webpartContext}
                    hidePopup={
                      this.hidePopup
                    }
                    loadorRefresh={
                      async () => { await this.LoadorRefreshApps(this._backUpApps); }
                    }
                    allapplications={this.state.allapplications}
                    userApplicationListItems={this.state.userApplicationListItems}
                    spHelper={this._spHelper}
                    applicationlistName={this.props.applicationlistName}
                    userApplicationlistName={this.props.userApplicationlistName}
                    adminUserlistName={this.props.adminUserlistName}
                    userMasterList={this.props.userMasterList}
                  />
                </div>
              </FocusTrapZone>
            </Popup>
            }
          </Layer>
        </div>
      </section>
    );
  }

  private LoadApplicationDashBoard(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
    return <div>
      <h3 className="mt-5">{myPinnedApplication}</h3>
      <div className={styles.tileContainer}>
        {this.state.loading &&
          <Spinner label={`Loading User Applications ...`} size={SpinnerSize.large} />}
        {!this.state.loading && this.state.userApplicationListItems.map(x => {
          return (
            ApplicationUI.renderTiles(x, this.props.dashBoardBackGroundColor)
          );
        })}
      </div>
    </div>;
  }
  private LoadApplicationDashBoardWithSearchBar(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
    return <div>
      <h3 className="mt-5">{myPinnedApplication}</h3>
      <div className={styles.searchContainer}>
        <SearchBox onSearch={(searchValue) => { this.SearchApplications(searchValue); }}
          onChange={
            (_, searchValue) => { this.SearchApplications(searchValue); }
          }
          className={styles.searchBox} />
      </div>
      <div className={styles.tileContainerMain}>
        {this.state.loading &&
          <Spinner label={`Loading Applications ...`} size={SpinnerSize.large} />}
        {!this.state.loading && this.state.applicationListItems.map(x => {
          return (
            ApplicationUI.renderTiles(x, this.props.dashBoardBackGroundColor)
          );
        })}
      </div>
      <div style={{ textAlign: 'center' }}>
        {!this.state.loading && <DefaultButton value={'Load More'} onClick={this.loadMoreApplications}>
          Load More...
        </DefaultButton>}
      </div>
    </div>;
  }
}
