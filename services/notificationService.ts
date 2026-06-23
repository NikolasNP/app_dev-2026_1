import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const token =
    (await Notifications.getExpoPushTokenAsync()).data;

  return token;
}

export async function enviarPush(
  expoPushToken: string,
  titulo: string,
  corpo: string
) {
  await fetch(
    'https://exp.host/--/api/v2/push/send',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        title: titulo,
        body: corpo,
      }),
    }
  );
}