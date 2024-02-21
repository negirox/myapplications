export interface ApplicationResponse {
    "@odata.context"?: string
    value: Applications[]
 }
export interface UserApplicationsResponse {
  "@odata.context"?: string
  value: UserApplications[]
}
export interface AdminConfigurationsResponse {
  "@odata.context"?: string
  value: AdminConfiguration[]
}
export interface UserMasterResponse {
  "@odata.context"?: string
  value: UserMaster[]
}
export interface Applications {
    Id: number,
    Title:string,
    IconURL: string,
    IsVisibleOnPage: boolean,
    IsAdminPushed:boolean,
    order:number;
    isSelected?:boolean
}
export interface UserApplicationsBase{
  UserSelectedApplications: string,
  UserRemovedApplications: string,
  ApplicationOrder:string,
  Title?:string,
}
export interface UserApplications extends UserApplicationsBase {
  Id: number
}
export interface AdminConfiguration {
  Id: number,
  Title:string,
  SelectedApplications: string,
  SelectedAppsId:number[]
}
export interface UserMaster {
  Id: number,
  Title:string,
  Department: string
}
  export const IconBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4QMARXhpZgAATU0AKgAAAAgABAE7AAIAAAASAAABSodpAAQAAAABAAABXJydAAEAAAAkAAAC1OocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATXVrZXNoIFNpbmdoIE5lZ2kAAAWQAwACAAAAFAAAAqqQBAACAAAAFAAAAr6SkQACAAAAAzc2AACSkgACAAAAAzc2AADqHAAHAAABDAAAAZ4AAAAAHOoAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMjQ6MDI6MDYgMTE6NDM6MzMAMjAyNDowMjowNiAxMTo0MzozMwAAAE0AdQBrAGUAcwBoACAAUwBpAG4AZwBoACAATgBlAGcAaQAAAP/hBCRodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDI0LTAyLTA2VDExOjQzOjMzLjc2MTwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5NdWtlc2ggU2luZ2ggTmVnaTwvcmRmOmxpPjwvcmRmOlNlcT4NCgkJCTwvZGM6Y3JlYXRvcj48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMABwUFBgUEBwYFBggHBwgKEQsKCQkKFQ8QDBEYFRoZGBUYFxseJyEbHSUdFxgiLiIlKCkrLCsaIC8zLyoyJyorKv/bAEMBBwgICgkKFAsLFCocGBwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKv/AABEIAEoATAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APpGiiigAoqKa5jgA8w8nooGSfwqLzruX/VQLGOxlbn8hQBaoqrtvv78H/fJo867i/1sCyD1iPP5GgC1RUUNxHcA+W3I6qeCPwqWgAooooAKguZzCqrGN0shwi/1+lT1UtR51xLctzzsT2A/+vQBJb2oiJdz5kzfec/09BU9FFABRXF2+n+Nv+FpzXlxfxf8IxsIS3BGT8mAMYyG38k56flXaU2rCK9xaiUiSM+XMv3XH8j6inW05mQhxtlQ4dfQ1NVS4HkXUVwOAx8t/cHoaQy3RRRQA1ztjYjsCahsBiwi/wB3NWCMgg9DVXTz/ogQ/ejYofwNAFqiiigDyC3spNG/aRtreLUL25S7snml+0zF8kq529htBUYHavX68Z1LxBpEf7SNjdPqVqttDZNbyzNMoSOQLICrNnAOSB9TXs3XpWlTp6ExCq2ojNhL7AEfnVmquoHNqIh1lYIPzrMosqcqD6iloooAKpyH7Jeeaf8AUzYD/wCy3Y1cpHRXQq4BUjBBoAWiqYE9nwoaeDsB95P8amju4JfuSrn0JwfyoAhk0jTZpGkl0+1d2OWZoFJJ9ScVc6dKTcPUfnUUl5BF96RSf7q8n8qAJqpxH7Xd+d/yyiyI/wDaPc0FZr3hw0EHcH7z/wCAq2qqihUGFAwAKAFooooAKKKKACo5LeKX/WRqx9SKkooArf2fa/8APFaljgii/wBVGq+4FSUUAFFFFABRRRQB/9k=';