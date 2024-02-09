import * as React from "react";
import { Applications, IconBase64 } from "../../model/SPResponse";
import styles from './../Myapplications.module.scss';
import { Checkbox } from "office-ui-fabric-react";
export class ApplicationUI extends React.Component{
    public static renderTiles(x: Applications, tilesBackGroundColor: string): JSX.Element {
        return <div className={styles.tile} style={{ backgroundColor: tilesBackGroundColor }}>
          <span>
            <a href='#'><img className={styles.notificationImage} src={IconBase64} /></a>
          </span>
          <img className={styles.tileimg} src={x.IconURL} alt={x.Title} />
          <h3 className="description" title={x.Title?.toUpperCase()}>
            {x.Title?.length > 10 ? x.Title.substring(0, 10) + '...' : x.Title?.toUpperCase()}
          </h3>
        </div>;
    }
    public static renderTilesWithCheckBox(x: Applications, tilesBackGroundColor: string): JSX.Element {
        return <div className={styles.tile} style={{ backgroundColor: tilesBackGroundColor }}>
          <img className={styles.tileimg} src={x.IconURL} alt={x.Title} />
          <h3 className="description" title={x.Title?.toUpperCase()}>
            {x.Title?.length > 10 ? x.Title.substring(0, 10) + '...' : x.Title?.toUpperCase()}
          </h3>
          <span>
            <Checkbox className={styles.applicationCheckBox} ></Checkbox>
          </span>
        </div>;
    }
}