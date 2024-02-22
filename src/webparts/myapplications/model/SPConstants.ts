import { mergeStyleSets } from "office-ui-fabric-react";

export const popupStyles = mergeStyleSets({
    root: {
      background: 'rgba(0, 0, 0, 0.2)',
      bottom: '0',
      left: '0',
      position: 'fixed',
      right: '0',
      top: '0',
    },
    content: {
      background: 'white',
      left: '50%',
      maxWidth: '70%',
      width:'60%',
      padding: '1.5rem',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      //borderTop: '4px solid rgb(0, 85, 150)',
      maxHeight: '70%',
      overflow: 'auto',
      //scrollbar: "thin",
      //scrollbarWidth:'thin',
      //scrollbarColor:'#c0bebe',
      fontSize: '12px'
    },
  });
export const ListNames = {
  UserMaster:'User Master',
  Applications: 'Applications',
  UserApplications:'UserApplications',
  AdminConfiguration : 'AdminConfiguration',
  LogList:'Log'
}
export const ToastrSettings = {
  WithButton: {
      "positionClass": 'toast-top-full-width',
      "closeButton": true,
      "newestOnTop": false,
      "progressBar": true,
      "preventDuplicates": false,
      "showDuration": "0",
      "hideDuration": "300",
      "timeOut": "5000",
      "extendedTimeOut": "0",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
  },
  AutoHide: {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
  }
}

export const postheaders = {
  headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-type': 'application/json;odata=nometadata',
      'odata-version': ''
  },
  body: ''
};
export const putHeaders = {
  headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-type': 'application/json;odata=nometadata',
      'odata-version': '',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
  },
  body: ''
}