// Importa o componente Stack do Expo Router.
// O Stack é utilizado para criar a navegação em pilha entre telas,
// semelhante ao funcionamento de aplicativos mobile tradicionais.

import { Stack } from 'expo-router';

// Componente principal responsável pela configuração das rotas da aplicação.
export default function Layout() {
  return (

    // Componente Stack que gerencia as telas da aplicação.
    // screenOptions permite definir configurações padrão para todas as telas.
    <Stack screenOptions={{ headerShown: false }}>
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

      {/* SUCESSO AO REMOVER */}
      <Stack.Screen name="remover_pet_sucesso" />
    </Stack>
  );
}