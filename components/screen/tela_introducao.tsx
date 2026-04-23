import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TelaIntroducao() {
  const router = useRouter();

  function irParaLogin() {
    router.replace('/login');
  }

  function irParaAdotar() {
    console.log('Ir para adoção');
  }

  function irParaAjudar() {
    console.log('Ir para ajudar');
  }
  {/* botão funcional tela_cadastrar_animal*/ }
  function irParaCadastrarAnimal() {
    router.push('/cadastrar_animal');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <TouchableOpacity style={styles.botaoMenu}>
          <Text style={styles.iconeMenu}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.ola}>Olá!</Text>

        <Text style={styles.texto}>
          Bem vindo ao Meau!{'\n'}
          Aqui você pode adotar, doar e ajudar{'\n'}
          cães e gatos com facilidade.{'\n'}
          Qual o seu interesse?
        </Text>

        <TouchableOpacity style={styles.botaoAmarelo} onPress={irParaAdotar}>
          <Text style={styles.textoBotao}>ADOTAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoAmarelo} onPress={irParaAjudar}>
          <Text style={styles.textoBotao}>AJUDAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoAmarelo} onPress={irParaCadastrarAnimal}>
          <Text style={styles.textoBotao}>CADASTRAR ANIMAL</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={irParaLogin}>
          <Text style={styles.login}>login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rodape}>
        <Text style={styles.logo}>méau</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  topo: {
    paddingTop: 20,
    paddingHorizontal: 18,
  },

  botaoMenu: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  iconeMenu: {
    fontSize: 24,
    color: '#9BD7D2',
    fontWeight: 'bold',
  },

  conteudo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
  },

  ola: {
    fontSize: 78,
    color: '#F2C94C',
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 30,
    fontWeight: '500',
  },

  texto: {
    fontSize: 18,
    color: '#8A8A8A',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 45,
    fontWeight: '500',
  },

  botaoAmarelo: {
    width: '78%',
    backgroundColor: '#F2C94C',
    paddingVertical: 15,
    borderRadius: 2,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },

  textoBotao: {
    fontSize: 16,
    color: '#6B6B6B',
    fontWeight: 'bold',
  },

  login: {
    marginTop: 30,
    fontSize: 18,
    color: '#9BD7D2',
    fontWeight: '500',
  },

  rodape: {
    alignItems: 'center',
    paddingBottom: 26,
  },

  logo: {
    fontSize: 54,
    color: '#9BD7D2',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});