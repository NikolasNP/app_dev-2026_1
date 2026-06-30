import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function pegarPushToken() {

  if (!Device.isDevice) {
    return null;
  }

  const permissao =
    await Notifications.requestPermissionsAsync();

  if (
    permissao.status !==
    'granted'
  ) {
    return null;
  }

  const token =
    await Notifications
      .getExpoPushTokenAsync();

  return token.data;
}
