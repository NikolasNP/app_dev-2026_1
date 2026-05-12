import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';
import MenuLateral from '../navigation/menu_lateral';

export default function TelaInicial() {
  const router = useRouter();

  async function sair() {
    await signOut(auth);
    router.replace('/');
  }

  return (
    <MenuLateral>
      {({ abrirMenu }) => (
        <View style={styles.container}>
          <View style={styles.topo}>
            <TouchableOpacity onPress={abrirMenu}>
              <Text style={styles.menu}>☰</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.conteudo}>
            <Text style={styles.ola}>Olá!</Text>

            <Text style={styles.texto}>
              Bem vindo ao Meau!{'\n'}
              Aqui você pode adotar, doar e cadastrar{'\n'}
              cães e gatos com facilidade.{'\n'}
              Qual o seu interesse?
            </Text>

            <TouchableOpacity
              style={styles.botaoAmarelo}
              onPress={() => router.push('/adotar')}
            >
              <Text style={styles.textoBotao}>ADOTAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoAmarelo}
              onPress={() => router.push('/cadastrar_animal')}
            >
              <Text style={styles.textoBotao}>CADASTRAR ANIMAL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoSair}
              onPress={sair}
            >
              <Text style={styles.textoSair}>SAIR</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rodape}>
            <Text style={styles.logo}>méau</Text>
          </View>
        </View>
      )}
    </MenuLateral>
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

  menu: {
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
  },

  textoBotao: {
    fontSize: 16,
    color: '#6B6B6B',
    fontWeight: 'bold',
  },

  botaoSair: {
    width: '78%',
    backgroundColor: '#8EDDD6',
    paddingVertical: 15,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },

  textoSair: {
    fontSize: 16,
    color: '#434343',
    fontWeight: 'bold',
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