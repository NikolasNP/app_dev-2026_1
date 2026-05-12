// Importa o componente da tela de introdução.
// Esse componente está localizado dentro da pasta components/screen.

import TelaIntroducao from '../components/screen/tela_introducao';

// Função principal da página inicial.
// No Expo Router, o arquivo index.tsx representa a rota principal do aplicativo.
export default function Index() {

   // Renderiza a tela de introdução na aplicação.
  return <TelaIntroducao />;
}


/*
import TelaLogin from '../components/screen/tela_login';

export default function Index() {
  return <TelaLogin />;
}





import TelaInicial from '../components/screens/TelaInicial';

export default function Index() {
  return <TelaInicial />;
}


import TelaCadastro from '../components/screens/TelaCadastro';

export default function Index() {
  return <TelaCadastro />;
}

*/