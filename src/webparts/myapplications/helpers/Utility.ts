export class Utility{
    public static GetIdFromString(objId:string):Number{
        if(objId === undefined && objId.length === 0){
            return 0;
        }
        else{
            const splitStrings = objId.split('_');
            const appId = splitStrings[splitStrings.length -1];
            return !isNaN(parseInt(appId)) ? parseInt(appId) : 0;
        }
    }
}