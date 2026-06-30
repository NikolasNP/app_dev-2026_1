import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { enviarPush } from '../../services/notificationService';
import { auth, db } from '../firebaseConfig';
import MenuLateral from '../navigation/menu_lateral';

type ConversaItem = {
  id: string;
  animalId: string;
  animalNome: string;
  animalFotoBase64?: string;
  donoId: string;
  interessadoId: string;
  participantes: string[];
  ultimaMensagem?: string;
  ativo?: boolean;
  atualizadoEm?: any;
  outroUsuarioNome?: string;
  outroUsuarioFoto?: string;
};

type InteresseItem = {
  id: string;
  animalId: string;
  animalNome: string;
  animalFotoBase64?: string;
  donoId: string;
  usuarioInteressadoId: string;
  status: string;
  interessadoNome: string;
  interessadoIdade?: string;
  interessadoFotoBase64?: string;
  interessadoToken?: string;
};

type Aba = 'conversas' | 'interessados';

export default function TelaConversas() {
  const router = useRouter();
  const usuario = auth.currentUser;

  const [aba, setAba] = useState<Aba>('conversas');

  const [conversas, setConversas] = useState<ConversaItem[]>([]);
  const [interesses, setInteresses] = useState<InteresseItem[]>([]);

  const [carregandoConversas, setCarregandoConversas] = useState(true);
  const [carregandoInteresses, setCarregandoInteresses] = useState(true);

  useEffect(() => {
    if (!usuario) {
      router.replace('/login');
      return;
    }

    const q = query(
      collection(db, 'chats'),
      where('participantes', 'array-contains', usuario.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const lista: ConversaItem[] = [];

      for (const docSnap of snapshot.docs) {
        const dados = docSnap.data() as Omit<ConversaItem, 'id'>;

        const outroUsuarioId =
          dados.donoId === usuario.uid
            ? dados.interessadoId
            : dados.donoId;

        let outroUsuarioNome = 'Usuário';
        let outroUsuarioFoto = '';

        const usuarioRef = doc(db, 'usuarios', outroUsuarioId);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          const usuarioDados = usuarioSnap.data();

          outroUsuarioNome =
            usuarioDados.nome || usuarioDados.usuario || 'Usuário';

          outroUsuarioFoto = usuarioDados.fotoBase64 || '';
        }

        lista.push({
          id: docSnap.id,
          ...dados,
          outroUsuarioNome,
          outroUsuarioFoto,
        });
      }

      lista.sort((a, b) => {
        const dataA = a.atualizadoEm?.toMillis?.() || 0;
        const dataB = b.atualizadoEm?.toMillis?.() || 0;
        return dataB - dataA;
      });

      setConversas(lista);
      setCarregandoConversas(false);
    });

    return () => unsubscribe();
  }, [usuario?.uid]);

  useEffect(() => {
    if (!usuario) return;

    const q = query(
      collection(db, 'interesses'),
      where('donoId', '==', usuario.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const lista: InteresseItem[] = [];

      for (const docSnap of snapshot.docs) {
        const interesseDados: any = docSnap.data();

        const animalId = interesseDados.animalId || interesseDados.petId;
        const usuarioInteressadoId =
          interesseDados.usuarioInteressadoId || interesseDados.interessadoId;

        if (!animalId || !usuarioInteressadoId) continue;

        let animalNome = interesseDados.animalNome || 'Animal';
        let animalFotoBase64 = interesseDados.animalFotoBase64 || '';

        const animalSnap = await getDoc(doc(db, 'animais', animalId));

        if (animalSnap.exists()) {
          const animalDados: any = animalSnap.data();

          animalNome = animalDados.nomeAnimal || animalNome;
          animalFotoBase64 = animalDados.fotoBase64 || animalFotoBase64;
        }

        let interessadoNome = 'Usuário';
        let interessadoIdade = '';
        let interessadoFotoBase64 = '';
        let interessadoToken = '';

        const usuarioSnap = await getDoc(
          doc(db, 'usuarios', usuarioInteressadoId)
        );

        if (usuarioSnap.exists()) {
          const dadosUsuario: any = usuarioSnap.data();

          interessadoNome =
            dadosUsuario.nome || dadosUsuario.usuario || 'Usuário';

          interessadoIdade = dadosUsuario.idade || '';
          interessadoFotoBase64 = dadosUsuario.fotoBase64 || '';
          interessadoToken = dadosUsuario.expoPushToken || '';
        }

        lista.push({
          id: docSnap.id,
          animalId,
          animalNome,
          animalFotoBase64,
          donoId: interesseDados.donoId,
          usuarioInteressadoId,
          status: interesseDados.status || 'pendente',
          interessadoNome,
          interessadoIdade,
          interessadoFotoBase64,
          interessadoToken,
        });
      }

      setInteresses(lista);
      setCarregandoInteresses(false);
    });

    return () => unsubscribe();
  }, [usuario?.uid]);

  if (!usuario) {
    return null;
  }

  function abrirChat(chatId: string) {
    router.push({
      pathname: '/chat' as any,
      params: { chatId },
    });
  }

  async function criarOuAbrirChat(interesse: InteresseItem) {
    try {
      const chatId = `${interesse.animalId}_${interesse.usuarioInteressadoId}`;

      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          animalId: interesse.animalId,
          animalNome: interesse.animalNome,
          animalFotoBase64: interesse.animalFotoBase64 || '',

          donoId: interesse.donoId,
          interessadoId: interesse.usuarioInteressadoId,

          participantes: [
            interesse.donoId,
            interesse.usuarioInteressadoId,
          ],

          ultimaMensagem: '',
          ativo: true,

          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
        });
      }

      abrirChat(chatId);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível abrir o chat.');
    }
  }

async function confirmarDoacao(interesse: InteresseItem) {
  Alert.alert(
    'Confirmar doação',
    `Deseja confirmar a doação de ${interesse.animalNome} para ${interesse.interessadoNome}?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          try {

            // Atualiza o interesse
            await updateDoc(doc(db, 'interesses', interesse.id), {
              status: 'aceito',
              respondidoEm: serverTimestamp(),
            });

            // Atualiza o animal
            await updateDoc(doc(db, 'animais', interesse.animalId), {
              usuarioId: interesse.usuarioInteressadoId,
              donoAnterior: interesse.donoId,
              disponivel: false,
              adotado: true,
              adotadoPor: interesse.usuarioInteressadoId,
              adotadoEm: serverTimestamp(),
            });

            // Remove dos pets do antigo dono
            await updateDoc(doc(db, 'usuarios', interesse.donoId), {
              animaisIds: arrayRemove(interesse.animalId),
            });

            // Adiciona ao novo dono
            await updateDoc(doc(db, 'usuarios', interesse.usuarioInteressadoId), {
              animaisIds: arrayUnion(interesse.animalId),
            });

            // ENVIA A PUSH APENAS UMA VEZ
            if (interesse.interessadoToken) {
              await enviarPush(
                interesse.interessadoToken,
                'Doação confirmada ❤️',
                `${interesse.animalNome} agora faz parte dos seus pets.`,
                {
                  tipo: 'doacao_confirmada',
                  animalId: interesse.animalId,
                  novoDonoId: interesse.usuarioInteressadoId,
                }
              );
            }

            Alert.alert(
              'Sucesso',
              'Doação confirmada com sucesso.'
            );

          } catch (error: any) {

            Alert.alert(
              'Erro',
              error.message || 'Não foi possível confirmar a doação.'
            );

          }
        },
      },
    ]
  );
}

  async function recusarAdocao(interesse: InteresseItem) {
  Alert.alert(
    'Recusar solicitação',
    `Deseja recusar a solicitação de ${interesse.interessadoNome}?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Recusar',
        style: 'destructive',
        onPress: async () => {
          try {
            await updateDoc(doc(db, 'interesses', interesse.id), {
              status: 'recusado',
              respondidoEm: serverTimestamp(),
            });

            if (interesse.interessadoToken) {
              await enviarPush(
                interesse.interessadoToken,
                'Solicitação recusada',
                `Sua solicitação para adotar ${interesse.animalNome} não foi aceita.`,
                {
                  tipo: 'doacao_recusada',
                  animalId: interesse.animalId,
                  interesseId: interesse.id,
                }
              );
            }

            Alert.alert(
              'Solicitação recusada',
              'A solicitação foi recusada. O interessado poderá demonstrar interesse novamente.'
            );
          } catch (error: any) {
            Alert.alert(
              'Erro',
              error.message || 'Não foi possível recusar a solicitação.'
            );
          }
        },
      },
    ]
  );
}

  function textoStatus(status: string) {
    if (status === 'aceito') return '🟢 Doação confirmada';
    if (status === 'recusado') return '🔴 Recusada';
    return '🟡 Pendente';
  }

  function renderConversa({ item }: { item: ConversaItem }) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => abrirChat(item.id)}
      >
        {item.animalFotoBase64 ? (
          <Image source={{ uri: item.animalFotoBase64 }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Ionicons name="paw-outline" size={34} color="#999" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.nomeAnimal}>{item.animalNome}</Text>

          <Text style={styles.nomeUsuario}>
            Conversa com {item.outroUsuarioNome}
          </Text>

          <Text style={styles.ultimaMensagem}>
            {item.ultimaMensagem || 'Nenhuma mensagem ainda.'}
          </Text>
        </View>

        <Ionicons name="chatbubble-outline" size={24} color="#434343" />
      </TouchableOpacity>
    );
  }

  function renderInteresse({ item }: { item: InteresseItem }) {
    const pendente = item.status !== 'aceito' && item.status !== 'recusado';

    return (
      <View style={styles.cardInteresse}>
        <View style={styles.linhaCard}>
          {item.animalFotoBase64 ? (
            <Image source={{ uri: item.animalFotoBase64 }} style={styles.foto} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Ionicons name="paw-outline" size={34} color="#999" />
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.nomeAnimal}>{item.animalNome}</Text>
            <Text style={styles.nomeUsuario}>
              Interessado: {item.interessadoNome}
            </Text>
            <Text style={styles.ultimaMensagem}>
              {item.interessadoIdade
                ? `${item.interessadoIdade} anos`
                : 'Idade não informada'}
            </Text>
            <Text style={styles.status}>{textoStatus(item.status)}</Text>
          </View>
        </View>

        <View style={styles.areaBotoes}>
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={() => criarOuAbrirChat(item)}
          >
            <Text style={styles.textoBotao}>CONVERSAR</Text>
          </TouchableOpacity>

          {pendente && (
            <>
              <TouchableOpacity
                style={styles.botaoAceitar}
                onPress={() => confirmarDoacao(item)}
              >
                <Text style={styles.textoBotao}>CONFIRMAR DOAÇÃO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoRecusar}
                onPress={() => recusarAdocao(item)}
              >
                <Text style={styles.textoBotao}>RECUSAR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <MenuLateral>
      {({ abrirMenu }) => (
        <View style={styles.container}>
          <View style={styles.statusBar} />

          <View style={styles.appBar}>
            <TouchableOpacity onPress={abrirMenu}>
              <Ionicons name="menu" size={24} color="#434343" />
            </TouchableOpacity>

            <Text style={styles.titulo}>Conversas</Text>

            <View style={{ width: 24 }} />
          </View>

          <View style={styles.abas}>
            <TouchableOpacity
              style={[
                styles.abaBotao,
                aba === 'conversas' && styles.abaAtiva,
              ]}
              onPress={() => setAba('conversas')}
            >
              <Text style={styles.abaTexto}>Conversas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.abaBotao,
                aba === 'interessados' && styles.abaAtiva,
              ]}
              onPress={() => setAba('interessados')}
            >
              <Text style={styles.abaTexto}>
                Interessados ({interesses.length})
              </Text>
            </TouchableOpacity>
          </View>

          {aba === 'conversas' ? (
            carregandoConversas ? (
              <View style={styles.centralizador}>
                <ActivityIndicator size="large" color="#88c9bf" />
              </View>
            ) : conversas.length === 0 ? (
              <View style={styles.centralizador}>
                <Ionicons name="chatbubbles-outline" size={64} color="#88c9bf" />
                <Text style={styles.textoVazio}>Nenhuma conversa encontrada.</Text>
              </View>
            ) : (
              <FlatList
                data={conversas}
                keyExtractor={(item) => item.id}
                renderItem={renderConversa}
                contentContainerStyle={styles.lista}
              />
            )
          ) : carregandoInteresses ? (
            <View style={styles.centralizador}>
              <ActivityIndicator size="large" color="#88c9bf" />
            </View>
          ) : interesses.length === 0 ? (
            <View style={styles.centralizador}>
              <Ionicons name="people-outline" size={64} color="#88c9bf" />
              <Text style={styles.textoVazio}>Nenhum interessado encontrado.</Text>
            </View>
          ) : (
            <FlatList
              data={interesses}
              keyExtractor={(item) => item.id}
              renderItem={renderInteresse}
              contentContainerStyle={styles.lista}
            />
          )}
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

  statusBar: {
    height: 24,
    backgroundColor: '#589b9b',
  },

  appBar: {
    height: 56,
    backgroundColor: '#88c9bf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  titulo: {
    fontSize: 20,
    fontWeight: '500',
    color: '#434343',
  },

  abas: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    gap: 8,
  },

  abaBotao: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#EDEDED',
  },

  abaAtiva: {
    backgroundColor: '#88c9bf',
  },

  abaTexto: {
    fontWeight: 'bold',
    color: '#434343',
    fontSize: 13,
  },

  lista: {
    padding: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  cardInteresse: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  linhaCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  foto: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#DDD',
  },

  fotoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  nomeAnimal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434343',
    marginBottom: 4,
  },

  nomeUsuario: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },

  ultimaMensagem: {
    fontSize: 13,
    color: '#999',
  },

  status: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#434343',
  },

  areaBotoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  botaoAcao: {
    flex: 1,
    backgroundColor: '#88c9bf',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },

  botaoAceitar: {
    flex: 1,
    backgroundColor: '#9BE7A1',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },

  botaoRecusar: {
    flex: 1,
    backgroundColor: '#e8a5a5',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },

  textoBotao: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#434343',
    textAlign: 'center',
  },

  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  textoVazio: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});