import { Stack } from 'expo-router';

import {
  useEffect
} from 'react';

import * as Notifications from 'expo-notifications';

export default function Layout() {

  useEffect(() => {

    const sub =
      Notifications
        .addNotificationReceivedListener(
          (notification) => {

            console.log(
              'Notificação recebida:',
              notification
            );

          }
        );

    return () => {
      sub.remove();
    };

  }, []);

  return (

    <Stack
      screenOptions={{
        headerShown: false
      }}
    >

      {/* TELAS PRINCIPAIS */}
      <Stack.Screen name="index" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="cadastrar_animal" />
      <Stack.Screen name="adotar" />

      {/* DETALHE PÚBLICO */}
      <Stack.Screen name="detalhe_animal" />

      {/* MEUS PETS */}
      <Stack.Screen name="meus_pets" />

      {/* DETALHE DO PET DO DONO */}
      <Stack.Screen name="detalhe_meu_pet" />

      {/* INTERESSADOS */}
      <Stack.Screen name="interessados_pet" />

      {/* SUCESSO */}
      <Stack.Screen
        name="remover_pet_sucesso"
      />

    </Stack>

  );
}