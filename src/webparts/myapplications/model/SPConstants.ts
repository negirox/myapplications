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
      padding: '1.5rem',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      borderTop: '4px solid rgb(0, 85, 150)',
      maxHeight: '70%',
      overflow: 'auto',
      scrollbar: "thin",
      fontSize: '12px'
    },
  });
export const ListNames = {
  UserMaster:'User Master',
  Applications: 'Applications',
  UserApplications:'UserApplications',
  AdminConfiguration : 'AdminConfiguration'
}