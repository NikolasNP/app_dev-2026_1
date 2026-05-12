// Importa o componente da tela de cadastro de animal.
// Esse componente está localizado dentro da pasta components/screen.

import CadastrarAnimal from '../components/screen/tela_cadastrar_animal';

// Função principal da página.
// Essa página será usada como rota dentro do Expo Router.
export default function CadastroAnimalPage() {


  // Renderiza o componente de cadastro do animal na tela.
  return <CadastrarAnimal />;
}