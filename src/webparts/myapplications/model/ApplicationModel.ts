import { Applications } from "./SPResponse";

export interface ApplicatioRecords {
    userApplicationsToRender: Applications[],
    applicationsToShow: Applications[],
    allApplications:  Applications[],
}