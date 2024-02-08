import * as React from 'react';
import styles from './Myapplications.module.scss';
import { IMyapplicationsProps } from './IMyapplicationsProps';
import { IMyApplicationState } from './IMyApplicationState';
import { IconBase64, Applications, ApplicationResponse, UserApplicationsResponse, AdminConfigurationsResponse, UserMasterResponse } from '../model/SPResponse';
import { DefaultButton, FocusTrapZone, Layer, Popup, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import EditMyApplication from './edit/EditMyApplications';
import { popupStyles } from '../model/SPConstants';
import { SPHelpers } from '../helpers/SPhelpers';
import { ISPHelper } from '../helpers/ISPhelper';
const defaultApplicationToShow = 4;
export default class Myapplications extends React.Component<IMyapplicationsProps, IMyApplicationState> {
  private _spHelper: ISPHelper;
  constructor(props: IMyapplicationsProps) {
    super(props);
    this.state = {
      applicationListItems: new Array<Applications>(),
      allapplications: new Array<Applications>(),
      userApplicationListItems: new Array<Applications>(),
      loading: true,
      isPopupVisible: false,
      itemCount: defaultApplicationToShow
    }
    this._spHelper = new SPHelpers(this.props.webpartContext.spHttpClient);
    this.hidePopup = this.hidePopup.bind(this);
    this._getUserApplications = this._getUserApplications.bind(this);
    this.loadMoreApplications = this.loadMoreApplications.bind(this);
  }
  async componentDidMount(): Promise<void> {
    const userMasterData = await this._spHelper.getUserMaster(this.props, this.props.webpartContext.pageContext.user.email,1);
    const Allapplications = await this._spHelper.getApplications(this.props, 4999);
    const userApplications = await this._getUserApplications(1);
    const adminApplications = await this._spHelper.getAdminConfiguration(this.props, 1);
    this.RenderUserApplications(Allapplications, userApplications, adminApplications,userMasterData);
    //setInterval(this.GetItems, 5000);
  }
  private async _getUserApplications(noofRecords: number): Promise<UserApplicationsResponse> {
    const filterValue = this.props.webpartContext.pageContext.user.email;
    return await this._spHelper.getUserApplications(this.props, filterValue, noofRecords);
  }
  private RenderUserApplications(applications: ApplicationResponse, userApplications: UserApplicationsResponse,
    adminConfiguration: AdminConfigurationsResponse,userMasterData:UserMasterResponse) {
    let renderedApplications: string[] = [];
    let adminApplications: string[] = [];
    let departmentApplications : string[] = [];
    if (adminConfiguration.value.length > 0) {
      adminApplications = adminConfiguration.value.filter(x => x.Title.toUpperCase() === 'All Users'.toUpperCase())[0].SelectedApplications.split(',');
      if(userMasterData){
        departmentApplications =  adminConfiguration.value.filter(x => x.Title.toUpperCase() === userMasterData.value[0].Department.toUpperCase())[0].SelectedApplications.split(',');
      }
    }
    if (userApplications.value && userApplications.value.length > 0) {
      const Userapplications = userApplications.value[0].UserSelectedApplications?.split(',');
      const RemovedApplications = userApplications.value[0].UserRemovedApplications?.split(',');
      renderedApplications = Userapplications.filter((n) => {
        return RemovedApplications.indexOf(n) !== -1;
      });
    }
    renderedApplications = renderedApplications.concat(adminApplications);
    const userApplicationsToRender = applications.value.filter((a) => {
      return renderedApplications.indexOf(a.Id.toString()) !== -1;
    });
    const applicationsToShow = applications.value.slice(0, defaultApplicationToShow);
    this.setState({
      userApplicationListItems: userApplicationsToRender,
      applicationListItems: applicationsToShow,
      allapplications: applications.value,
      loading: false
    });
  }
  private hidePopup(): void {
    this.setState({
      isPopupVisible: false
    });
  }
  private async loadMoreApplications(): Promise<void> {
    const newCount = this.state.itemCount + defaultApplicationToShow;
    const applications = this.state.allapplications.slice(0, newCount);
    this.setState({
      applicationListItems: applications,
      loading: false
    });
  }
  public render(): React.ReactElement<IMyapplicationsProps> {
    const myPinnedApplication = `My Pinned Applications`;
    const allApplications = `All Applications`;
    return (
      <section>
        <div>
          <DefaultButton onClick={() => {
            this.setState({ isPopupVisible: true });
          }}>
            + Pin an Application
          </DefaultButton>
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
                  <EditMyApplication
                    webPartContext={this.props.webpartContext}
                    hidePopup={
                      this.hidePopup
                    }
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
          <Spinner label={`Loading Applications ...`} size={SpinnerSize.large} />}
        {!this.state.loading && this.state.userApplicationListItems.map(x => {
          return (
            this.renderTiles(x, isSearchBar)
          );
        })}
      </div>
    </div>;
  }
  private LoadApplicationDashBoardWithSearchBar(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
    return <div>
      <h3 className="mt-5">{myPinnedApplication}</h3>
      <div className={styles.tileContainer}>
        {this.state.loading &&
          <Spinner label={`Loading Applications ...`} size={SpinnerSize.large} />}
        {!this.state.loading && this.state.applicationListItems.map(x => {
          return (
            this.renderTiles(x, isSearchBar)
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

  private renderTiles(x: Applications, isSearchbar: boolean): JSX.Element {
    return <div className={styles.tile} style={{ backgroundColor: this.props.tilesBackGroundColor }}>
      <span>
        <img className={styles.notificationImage} src={IconBase64} />
      </span>
      <img className={styles.tileimg} src={x.IconURL} alt={x.Title} />
      <h3 className="description" title={x.Title?.toUpperCase()}>
        {x.Title?.length > 10 ? x.Title.substring(0, 10) + '...' : x.Title?.toUpperCase()}
      </h3>
    </div>;
  }
}
