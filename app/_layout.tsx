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
              '📩 Notificação recebida:',
              notification
            );

          }
        );

    const resposta =
      Notifications
        .addNotificationResponseReceivedListener(
          (response) => {

            console.log(
              '👆 Notificação clicada:',
              response
            );

          }
        );

    return () => {

      sub.remove();

      resposta.remove();

    };

  }, []);

  return (

    <Stack
      screenOptions={{
        headerShown: false
      }}
    >

      {/* PRINCIPAIS */}
      <Stack.Screen
        name="index"
      />

      <Stack.Screen
        name="cadastro"
      />

      <Stack.Screen
        name="cadastrar_animal"
      />

      <Stack.Screen
        name="adotar"
      />

      {/* DETALHE */}
      <Stack.Screen
        name="detalhe_animal"
      />

      {/* MEUS PETS */}
      <Stack.Screen
        name="meus_pets"
      />

      <Stack.Screen
        name="detalhe_meu_pet"
      />

      {/* INTERESSADOS */}
      <Stack.Screen
        name="interessados_pet"
      />

      {/* OUTRAS */}
      <Stack.Screen
        name="remover_pet_sucesso"
      />

    </Stack>

  );

}