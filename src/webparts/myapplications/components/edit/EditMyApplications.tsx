import * as React from "react";
import { IEditMyApplication } from "./IEditMyApplication";
import { IEditApplicationState } from "./IEditApplicationState";

export default class EditMyApplication extends React.Component<IEditMyApplication, IEditApplicationState> {
    constructor(props: IEditMyApplication) {
        super(props);
    }
    public render(): React.ReactElement<IEditMyApplication> {
        return (
            <section>
                <div>
                    In Edit Application
                    <input type="button" value='Cancel' onClick={()=>{
                        this.props.hidePopup();
                    }} />
                </div>
            </section>
        )
    }
}