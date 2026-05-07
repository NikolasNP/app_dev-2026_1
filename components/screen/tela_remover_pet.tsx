import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TelaRemoverPet() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* STATUS BAR */}
      <View style={styles.statusBar} />

      {/* APP BAR */}
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#434343"
          />
        </TouchableOpacity>

        <Text style={styles.appBarTitulo}>
          Remover pet
        </Text>

        {/* Espaço vazio para balancear */}
        <View style={{ width: 24 }} />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>
          Pronto!
        </Text>

        <Text style={styles.texto}>
          O pet foi removido da nossa lista
          com sucesso!
        </Text>

        <Text style={styles.texto}>
          Porém, as conversas relacionadas
          à ele serão mantidas para o caso
          de você desejar manter contato.
        </Text>

        <Text style={styles.texto}>
          Caso deseje apagá-las, você pode
          realizar esta ação nas
          configurações no chat dos
          usuários relacionados à este pet.
        </Text>

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.botao}
          onPress={() =>
            router.replace(
              '/meus_pets'
            )
          }
        >
          <Text style={styles.textoBotao}>
            VOLTAR À MEUS PETS
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  statusBar: {
    height: 24,
    backgroundColor: '#88c9bf',
  },

  appBar: {
    height: 56,
    backgroundColor: '#cfe9e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    paddingHorizontal: 16,
  },

  appBarTitulo: {
    fontSize: 20,
    fontWeight: '500',
    color: '#434343',
  },

  conteudo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 52,
    paddingTop: 52,
  },

  titulo: {
    fontSize: 53,
    color: '#88c9bf',
    marginBottom: 52,
    fontFamily: 'serif',
  },

  texto: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },

  botao: {
    marginTop: 52,
    width: 232,
    height: 40,
    borderWidth: 2,
    borderColor: '#88c9bf',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoBotao: {
    fontSize: 12,
    color: '#434343',
    fontWeight: '500',
  },
});