import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ipol.chatApp',
  appName: 'Ipol Chat',
  webDir: 'build',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  server: {
    androidScheme: 'https',
    // url: 'https://chat.indopoly.co.id',
    cleartext: true
  }
};

export default config;
