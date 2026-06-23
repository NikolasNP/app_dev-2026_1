import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
export async function registerForPushNotifications() {

  console.log('Iniciando push...');

  if (!Device.isDevice) {
    console.log('Não é dispositivo físico');
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  console.log(
    'Permissão atual:',
    existingStatus
  );

  let finalStatus =
    existingStatus;

  if (
    existingStatus !==
    'granted'
  ) {

    const {
      status
    } =
      await Notifications
        .requestPermissionsAsync();

    finalStatus =
      status;

  }

  console.log(
    'Permissão final:',
    finalStatus
  );

  if (
    finalStatus !==
    'granted'
  ) {

    console.log(
      'Permissão negada'
    );

    return null;
  }

  const token =
    (
      await Notifications
        .getExpoPushTokenAsync({
          projectId:
          'f8d91315-87ec-4ba2-a0a6-37c398f0c6cb'
        })
    ).data;

  console.log(
    'TOKEN GERADO:',
    token
  );

  return token;
}

export async function enviarPush(
  expoPushToken: string,
  titulo: string,
  corpo: string
) {

  console.log(
    'Enviando push para:',
    expoPushToken
  );

  const resposta =
    await fetch(
      'https://exp.host/--/api/v2/push/send',
      {
        method: 'POST',

        headers: {
          Accept:
            'application/json',

          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          to:
            expoPushToken,

          title:
            titulo,

          body:
            corpo,
        }),
      }
    );

  const resultado =
    await resposta.json();

  console.log(
    'Resposta Expo:',
    resultado
  );
}