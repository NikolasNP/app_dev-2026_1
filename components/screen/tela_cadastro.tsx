import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TelaCadastro() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
    {/* router.back é para voltar */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.seta}>←</Text>
        </TouchableOpacity>
        <Text style={styles.tituloTopo}>Cadastro</Text>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.ops}>Ops!</Text>

        <Text style={styles.texto}>
          Você não pode realizar esta ação sem{'\n'}
          possuir um cadastro.
        </Text>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.botaoTexto}>FAZER CADASTRO</Text>
        </TouchableOpacity>

        <Text style={styles.subtexto}>Já possui cadastro?</Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.botaoTexto}>FAZER LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  seta: {
    fontSize: 28,
    color: '#333',
    marginRight: 20,
  },
  tituloTopo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  conteudo: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 24,
  },
  ops: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#8EDDD6',
    marginBottom: 50,
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
  },
  subtexto: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});