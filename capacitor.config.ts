import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ipol.chatApp',
  appName: 'Ipol Chat',
  webDir: 'build',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    StatusBar: {
      overlaysWebView: true
    }
  },
  server: {
    androidScheme: 'https',
    // url: 'https://chat.indopoly.co.id',    
  }
};

export default config;
