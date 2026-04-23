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
            <TouchableOpacity style={styles.botaoMenu} onPress={abrirMenu}>
              <Text style={styles.textoMenu}>☰</Text>
            </TouchableOpacity>

            <Text style={styles.tituloTopo}>Tela Inicial</Text>

            <View style={styles.espacoDireita} />
          </View>

          <View style={styles.conteudo}>
            <Text style={styles.ops}>Bem-vindo!</Text>

            <Text style={styles.texto}>
              Você realizou login com sucesso{'\n'}
              no sistema.
            </Text>

            <TouchableOpacity style={styles.botao} onPress={sair}>
              <Text style={styles.botaoTexto}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </MenuLateral>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topo: {
    backgroundColor: '#8EDDD6',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  botaoMenu: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  textoMenu: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
  },

  tituloTopo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },

  espacoDireita: {
    width: 40,
  },

  conteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  ops: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8EDDD6',
    marginBottom: 40,
  },

  texto: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },

  botao: {
    width: '90%',
    backgroundColor: '#8EDDD6',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 28,
    elevation: 3,
  },

  botaoTexto: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});