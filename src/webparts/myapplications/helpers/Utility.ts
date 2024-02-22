import * as jQuery from 'jquery';
export class Utility{
    public static GetIdFromString(objId:string):number{
        if(objId === undefined && objId.length === 0){
            return 0;
        }
        else{
            const splitStrings = objId.split('_');
            const appId = splitStrings[splitStrings.length -1];
            return !isNaN(parseInt(appId)) ? parseInt(appId) : 0;
        }
    }
    public static GetUniqueId():string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
    public setFullWidth(dynamicId:string): void {
        const element = jQuery("#" + dynamicId);
        if (element.length > 0) {
          element.parentsUntil(".Canvas.grid").removeAttr("class");
        }
        else {
          setTimeout(this.setFullWidth, 500);
        }
    }
}