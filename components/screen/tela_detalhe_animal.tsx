import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function TelaDetalheAnimal() {
  const router = useRouter();
  const { animal } = useLocalSearchParams();

  const dados = JSON.parse(animal as string);

  async function abrirChatAdocao() {
    const usuario = auth.currentUser;

    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para iniciar uma conversa.');
      router.replace('/login');
      return;
    }

    if (usuario.uid === dados.usuarioId) {
      Alert.alert('Aviso', 'Você não pode demonstrar interesse no seu próprio animal.');
      return;
    }

    const chatId = `${dados.id}_${usuario.uid}`;

    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        animalId: dados.id,
        animalNome: dados.nomeAnimal,
        animalFotoBase64: dados.fotoBase64 || '',
        donoId: dados.usuarioId,
        interessadoId: usuario.uid,
        participantes: [dados.usuarioId, usuario.uid],
        ultimaMensagem: '',
        ativo: true,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      });
    }

    router.push({
      pathname: '/chat',
      params: { chatId },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.icone}>←</Text>
        </TouchableOpacity>

        <Text style={styles.tituloTopo}>{dados.nomeAnimal}</Text>

        <Text style={styles.icone}>⌯</Text>
      </View>

      <ScrollView>
        <Image
          source={{ uri: dados.fotoBase64 || dados.fotoUri }}
          style={styles.foto}
        />

        <View style={styles.bolinhaArea}>
          <Text style={styles.bolinhaAtiva}>●</Text>
          <Text style={styles.bolinha}>○</Text>
          <Text style={styles.bolinha}>○</Text>
          <Text style={styles.bolinha}>○</Text>
        </View>

        <TouchableOpacity style={styles.favorito}>
          <Text style={styles.coracao}>♡</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.nome}>{dados.nomeAnimal}</Text>

          <View style={styles.linhaTres}>
            <Info titulo="SEXO" valor={dados.sexo || 'Não informado'} />
            <Info titulo="PORTE" valor={dados.porte || 'Não informado'} />
            <Info titulo="IDADE" valor={dados.idade || 'Não informado'} />
          </View>

          <Info titulo="LOCALIZAÇÃO" valor="Samambaia Sul – Distrito Federal" />

          <View style={styles.divisor} />

          <View style={styles.linhaDuas}>
            <Info titulo="CASTRADO" valor={dados.saude?.includes('Castrado') ? 'Sim' : 'Não'} />
            <Info titulo="VERMIFUGADO" valor={dados.saude?.includes('Vermifugado') ? 'Sim' : 'Não'} />
          </View>

          <View style={styles.linhaDuas}>
            <Info titulo="VACINADO" valor={dados.saude?.includes('Vacinado') ? 'Sim' : 'Não'} />
            <Info titulo="DOENÇAS" valor={dados.saude?.includes('Doente') ? 'Sim' : 'Nenhuma'} />
          </View>

          <View style={styles.divisor} />

          <Info
            titulo="TEMPERAMENTO"
            valor={dados.temperamento?.length ? dados.temperamento.join(', ') : 'Não informado'}
          />

          <View style={styles.divisor} />

          <Info
            titulo="EXIGÊNCIAS DO DOADOR"
            valor="Termo de adoção, fotos da casa, visita prévia e acompanhamento durante três meses"
          />

          <View style={styles.divisor} />

          <Info
            titulo={`MAIS SOBRE ${dados.nomeAnimal?.toUpperCase() || 'O ANIMAL'}`}
            valor={dados.descricao || 'Nenhuma descrição informada.'}
          />

          <TouchableOpacity style={styles.botao} onPress={abrirChatAdocao}>
            <Text style={styles.textoBotao}>PRETENDO ADOTAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Info({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoTitulo}>{titulo}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },

  topo: {
    height: 80,
    paddingTop: 28,
    paddingHorizontal: 20,
    backgroundColor: '#FFE4A3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  icone: {
    fontSize: 30,
    color: '#666',
  },

  tituloTopo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#434343',
  },

  foto: {
    width: '100%',
    height: 230,
    resizeMode: 'cover',
  },

  bolinhaArea: {
    position: 'absolute',
    top: 285,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
  },

  bolinhaAtiva: {
    color: '#FFF',
    fontSize: 22,
  },

  bolinha: {
    color: '#FFF',
    fontSize: 22,
  },

  favorito: {
    position: 'absolute',
    right: 18,
    top: 250,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  coracao: {
    fontSize: 34,
    color: '#666',
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    backgroundColor: '#F7F7F7',
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#434343',
    marginBottom: 12,
  },

  linhaTres: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  linhaDuas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoBox: {
    flex: 1,
    marginBottom: 14,
  },

  infoTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F5A400',
    marginBottom: 4,
  },

  infoValor: {
    fontSize: 16,
    color: '#666',
    lineHeight: 21,
  },

  divisor: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 14,
  },

  botao: {
    backgroundColor: '#FFD45A',
    paddingVertical: 16,
    marginTop: 24,
    marginHorizontal: 38,
    alignItems: 'center',
    borderRadius: 3,
    elevation: 3,
  },

  textoBotao: {
    fontWeight: 'bold',
    color: '#434343',
  },
});