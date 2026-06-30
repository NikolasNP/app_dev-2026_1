import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

type Mensagem = {
  id: string;
  texto: string;
  autorId: string;
  autorNome: string;
  criadoEm?: any;
};

export default function TelaChat() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();

  const usuario = auth.currentUser;

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');

  const listaRef = useRef<FlatList<Mensagem>>(null);

  // Carrega o nome do usuário logado para salvar junto com a mensagem
  useEffect(() => {
    async function carregarUsuario() {
      if (!usuario) return;

      const usuarioRef = doc(db, 'usuarios', usuario.uid);
      const usuarioSnap = await getDoc(usuarioRef);

      if (usuarioSnap.exists()) {
        const dados = usuarioSnap.data();

        setNomeUsuario(
          dados.nome ||
            dados.usuario ||
            usuario.email ||
            'Usuário'
        );
      }
    }

    carregarUsuario();
  }, []);

  // Liga o listener em tempo real quando entra no chat
  // e desliga automaticamente quando sai da tela ou troca de conversa
  useEffect(() => {
    if (!usuario || !chatId) return;

    let ativo = true;

    const mensagensRef = collection(
      db,
      'chats',
      String(chatId),
      'mensagens'
    );

    const q = query(mensagensRef, orderBy('criadoEm', 'asc'));

    console.log('🟢 Listener do chat iniciado');

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!ativo) return;

        const lista: Mensagem[] = snapshot.docs.map((docSnap) => {
          const dados = docSnap.data();

          return {
            id: docSnap.id,
            texto: dados.texto,
            autorId: dados.autorId,
            autorNome: dados.autorNome || 'Usuário',
            criadoEm: dados.criadoEm,
          };
        });

        setMensagens(lista);

        setTimeout(() => {
          listaRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
      (erro) => {
        console.log('Erro no listener do chat:', erro);
      }
    );

    return () => {
      console.log('🔴 Listener do chat encerrado');
      ativo = false;
      unsubscribe();
      setMensagens([]);
    };
  }, [chatId, usuario?.uid]);

  // Envia mensagem para a subcoleção chats/{chatId}/mensagens
  async function enviarMensagem() {
    if (!usuario || !chatId || !texto.trim()) return;

    const textoMensagem = texto.trim();

    setTexto('');

    await addDoc(collection(db, 'chats', String(chatId), 'mensagens'), {
      texto: textoMensagem,
      autorId: usuario.uid,
      autorNome: nomeUsuario,
      criadoEm: serverTimestamp(),
    });

    await updateDoc(doc(db, 'chats', String(chatId)), {
      ultimaMensagem: textoMensagem,
      atualizadoEm: serverTimestamp(),
    });
  }

  // Exclui a conversa e todas as mensagens salvas no Firestore
  async function excluirChat() {
    if (!chatId) return;

    Alert.alert(
      'Excluir conversa',
      'Tem certeza que deseja excluir esta conversa? Essa ação apagará todas as mensagens para todos os participantes.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const mensagensRef = collection(
                db,
                'chats',
                String(chatId),
                'mensagens'
              );

              const mensagensSnap = await getDocs(mensagensRef);

              for (const mensagemDoc of mensagensSnap.docs) {
                await deleteDoc(
                  doc(
                    db,
                    'chats',
                    String(chatId),
                    'mensagens',
                    mensagemDoc.id
                  )
                );
              }

              await deleteDoc(doc(db, 'chats', String(chatId)));

              Alert.alert('Sucesso', 'Conversa excluída.');
              router.replace('/conversas');
            } catch (error: any) {
              Alert.alert(
                'Erro',
                error.message || 'Não foi possível excluir a conversa.'
              );
            }
          },
        },
      ]
    );
  }

  function renderMensagem({ item }: { item: Mensagem }) {
    const minhaMensagem = item.autorId === usuario?.uid;

    return (
      <View
        style={[
          styles.mensagemContainer,
          minhaMensagem
            ? styles.minhaMensagemContainer
            : styles.outraMensagemContainer,
        ]}
      >
        <Text
          style={[
            styles.nomeAutor,
            minhaMensagem
              ? styles.nomeAutorDireita
              : styles.nomeAutorEsquerda,
          ]}
        >
          {minhaMensagem ? 'Você' : item.autorNome}
        </Text>

        <View
          style={[
            styles.balao,
            minhaMensagem ? styles.meuBalao : styles.outroBalao,
          ]}
        >
          <Text
            style={[
              styles.textoMensagem,
              minhaMensagem
                ? styles.textoMeuBalao
                : styles.textoOutroBalao,
            ]}
          >
            {item.texto}
          </Text>
        </View>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.centralizador}>
        <Text>Você precisa estar logado.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Chat</Text>

        <TouchableOpacity onPress={excluirChat}>
          <Text style={styles.excluir}>🗑</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listaRef}
        data={mensagens}
        keyExtractor={(item) => item.id}
        renderItem={renderMensagem}
        contentContainerStyle={styles.lista}
        onContentSizeChange={() =>
          listaRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.areaInput}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#888"
          value={texto}
          onChangeText={setTexto}
          multiline
        />

        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
          <Text style={styles.textoEnviar}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  topo: {
    height: 80,
    paddingTop: 28,
    paddingHorizontal: 16,
    backgroundColor: '#88c9bf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  voltar: {
    fontSize: 28,
    color: '#434343',
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#434343',
  },

  excluir: {
    fontSize: 22,
    color: '#434343',
  },

  lista: {
    padding: 16,
    paddingBottom: 24,
  },

  mensagemContainer: {
    maxWidth: '78%',
    marginBottom: 14,
  },

  minhaMensagemContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },

  outraMensagemContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },

  nomeAutor: {
    fontSize: 12,
    marginBottom: 4,
    color: '#666',
    fontWeight: 'bold',
  },

  nomeAutorDireita: {
    textAlign: 'right',
  },

  nomeAutorEsquerda: {
    textAlign: 'left',
  },

  balao: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },

  meuBalao: {
    backgroundColor: '#6C5CE7',
    borderBottomRightRadius: 4,
  },

  outroBalao: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    elevation: 2,
  },

  textoMensagem: {
    fontSize: 15,
    lineHeight: 20,
  },

  textoMeuBalao: {
    color: '#FFFFFF',
  },

  textoOutroBalao: {
    color: '#333333',
  },

  areaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#F2F2F2',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },

  botaoEnviar: {
    backgroundColor: '#88c9bf',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    marginLeft: 8,
  },

  textoEnviar: {
    color: '#434343',
    fontWeight: 'bold',
  },

  centralizador: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});