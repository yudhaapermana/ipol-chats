// export const connection = new signalR.HubConnectionBuilder().withUrl(`${API_URL}signalr`, { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets }).withAutomaticReconnect().build();

// export const startConnection = async () => {
//   if (connection.state == signalR.HubConnectionState.Disconnected) {
//     try {
//       await connection.start();
//       console.log('SignalR Connected.');
//     } catch (error) {
//       console.error('SignalR Connection Error: ', error);
//       setTimeout(startConnection, 5000);
//     }
//   }
// };

import { hubConnection } from 'signalr-no-jquery';
const API_URL = process.env.REACT_APP_URL_API.replace(/\/$/, '');

const connection = hubConnection(`${API_URL}/signalr`, { useDefaultPath: false, withCredentials: false });
export const hubProxy = connection.createHubProxy('ChatHub');

let isRegistered = false;

const registerUser = () => {
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  if (!lgdata) return;

  hubProxy
    .invoke('Register', lgdata?.Keys)
    .done(() => {
      isRegistered = true;
      console.log(`Registered to group: user_${lgdata?.Keys}`);
    })
    .fail(error => console.error('SignalR Registration Error: ' + error));
};

export const startConnection = () => {
  if (connection.state !== 1) {
    connection
      .start()
      .done(() => {
        console.log('SignalR Connected!');
        registerUser();
      })
      .fail(error => console.error('SignalR Connection Error: ' + error));
  } else if (!isRegistered) {
    // Koneksi sudah aktif tapi belum pernah Register -> pastikan tetap ke-register
    registerUser();
  }
};
  
connection.reconnecting(() => {
  console.log('SignalR reconnecting...');
  isRegistered = false;   // reset flag, karena kemungkinan besar perlu register ulang di server
});

connection.reconnected(() => {
  console.log('SignalR reconnected!');
  registerUser();
});

connection.disconnected(() => {
  console.log('SignalR disconnected.');
  isRegistered = false;
});

export default connection;

// export const startConnection = () => {
//   const lgdata = JSON.parse(localStorage.getItem('userData'));
//   if (connection.state !== 1) {
//     connection
//       .start()
//       .done(() => {
//         console.log('SignalR Connected!');
//         if (lgdata) {
//           hubProxy
//             .invoke('Register', lgdata?.Keys)
//             .done(() => console.log(`Registered to group: user_${lgdata?.Keys}`))
//             .fail(error => console.error('SignalR Registration Error: ' + error));
//         }
//       })
//       .fail(error => console.error('SignalR Connection Error: ' + error));
//   }
// };

// export default connection;
