import * as React from "react";
import { IEditMyApplication } from "./IEditMyApplication";
import { IEditApplicationState } from "./IEditApplicationState";
import styles from "../Myapplications.module.scss";
import { SearchBox, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { ApplicationUI } from "../application-ui/ApplicationsUI";
const myPinnedApplication = `My Pinned Applications`;
const allApplications = `All Applications`;
export default class EditMyApplication extends React.Component<IEditMyApplication, IEditApplicationState> {
    constructor(props: IEditMyApplication) {
        super(props);
        this.state = {
            applicationListItems:this.props.allapplications,
            userApplicationListItems:this.props.userApplicationListItems,
            loading:false     
        }
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
    private LoadApplicationDashBoard(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
        return <div>
          <h3 className="mt-5">{myPinnedApplication}</h3>
          <div className={styles.tileContainer}>
            {this.state.loading &&
              <Spinner label={`Loading Applications ...`} size={SpinnerSize.large} />}
            {!this.state.loading && this.state.userApplicationListItems.map(x => {
              return (
                ApplicationUI.renderTilesWithCheckBox(x, '#fff')
              );
            })}
          </div>
        </div>;
    }
    private LoadApplicationDashBoardWithSearchBar(myPinnedApplication: string, isSearchBar: boolean = false): JSX.Element {
        return <div>
          <h3 className="mt-5">{myPinnedApplication}</h3>
          <div>
            <SearchBox ></SearchBox>
          </div>
          <div className={styles.tileContainer}>
            {this.state.loading &&
              <Spinner label={`Loading Applications ...`} size={SpinnerSize.large} />}
            {!this.state.loading && this.state.applicationListItems.map(x => {
              return (
                ApplicationUI.renderTiles(x, this.props.dashBoardBackGroundColor)
              );
            })}
          </div>
        </div>;
      }
}