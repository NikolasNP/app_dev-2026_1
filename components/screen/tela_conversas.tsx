import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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

export default function TelaConversas() {
  const router = useRouter();
  const usuario = auth.currentUser;

  const [conversas, setConversas] = useState<ConversaItem[]>([]);
  const [carregando, setCarregando] = useState(true);

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
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (!usuario) {
    return null;
  }

  function abrirChat(chatId: string) {
    router.push({
      pathname: '/chat' as any,
      params: { chatId },
    });
  }

  function renderItem({ item }: { item: ConversaItem }) {
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

          {carregando ? (
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
              renderItem={renderItem}
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
  },
});