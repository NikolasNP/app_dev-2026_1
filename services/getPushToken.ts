import * as Notifications from 'expo-notifications';

export async function getPushToken() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  console.log('TOKEN:', token);

  return token;
}