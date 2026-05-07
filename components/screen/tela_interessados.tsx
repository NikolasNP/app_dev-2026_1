import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

import { db } from '../firebaseConfig';

type Interessado = {
  id: string;

  usuarioId: string;

  nome: string;

  idade?: string;

  fotoBase64?: string;
};

type Interesse = {
  id: string;

  animalId: string;

  usuarioInteressadoId: string;
};

export default function TelaInteressados() {
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const [interessados, setInteressados] = useState<
    Interessado[]
  >([]);

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    carregarInteressados();
  }, []);

  async function carregarInteressados() {
    try {
      const q = query(
        collection(db, 'interesses'),
        where('animalId', '==', id)
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const interesses: Interesse[] =
            snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Omit<
                Interesse,
                'id'
              >),
            }));

          const usuarios: Interessado[] = [];

          for (const interesse of interesses) {
            const usuarioRef = doc(
              db,
              'usuarios',
              interesse.usuarioInteressadoId
            );

            const usuarioSnap =
              await getDoc(usuarioRef);

            if (usuarioSnap.exists()) {
              const dados =
                usuarioSnap.data();

              usuarios.push({
                id: usuarioSnap.id,
                usuarioId: usuarioSnap.id,
                nome:
                  dados.nome ||
                  'Usuário',
                idade: dados.idade,
                fotoBase64:
                  dados.fotoBase64,
              });
            }
          }

          setInteressados(usuarios);

          setCarregando(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.log(error);

      setCarregando(false);
    }
  }

  function abrirChat() {
    return;
  }

  function renderItem({
    item,
  }: {
    item: Interessado;
  }) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => abrirChat(item)}
      >
        {/* FOTO */}
        {item.fotoBase64 ? (
          <Image
            source={{
              uri: item.fotoBase64,
            }}
            style={styles.foto}
          />
        ) : (
          <View
            style={styles.fotoPlaceholder}
          >
            <Ionicons
              name="person-outline"
              size={36}
              color="#999"
            />
          </View>
        )}

        {/* INFOS */}
        <View style={styles.infoArea}>
          <Text style={styles.nome}>
            {item.nome}
          </Text>

          <Text style={styles.idade}>
            {item.idade
              ? `${item.idade} anos`
              : 'Idade não informada'}
          </Text>
        </View>

        {/* ÍCONE */}
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color="#434343"
        />
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator
          size="large"
          color="#88c9bf"
        />
      </View>
    );
  }

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
          Interessados
        </Text>

        <Ionicons
          name="search"
          size={24}
          color="#434343"
        />
      </View>

      {/* LISTA */}
      {interessados.length === 0 ? (
        <View style={styles.vazio}>
          <Ionicons
            name="people-outline"
            size={64}
            color="#88c9bf"
          />

          <Text style={styles.textoVazio}>
            Nenhum interessado ainda.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={interessados}
            keyExtractor={(item) =>
              item.id
            }
            renderItem={renderItem}
            contentContainerStyle={
              styles.lista
            }
            showsVerticalScrollIndicator={
              false
            }
          />

          {/* BOTÃO */}
          <View style={styles.areaBotao}>
            <TouchableOpacity
              style={styles.botaoChat}
              onPress={() => {
                if (
                  interessados.length > 0
                ) {
                  abrirChat(
                    interessados[0]
                  );
                }
              }}
            >
              <Text
                style={
                  styles.textoBotao
                }
              >
                IR PARA O CHAT
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  appBarTitulo: {
    fontSize: 20,
    fontWeight: '500',
    color: '#434343',
  },

  lista: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  foto: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#DDD',
  },

  fotoPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoArea: {
    flex: 1,
    marginLeft: 16,
  },

  nome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#434343',
    marginBottom: 8,
  },

  idade: {
    fontSize: 14,
    color: '#757575',
  },

  areaBotao: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
  },

  botaoChat: {
    width: 232,
    height: 40,
    backgroundColor: '#88c9bf',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoBotao: {
    fontSize: 12,
    color: '#434343',
    fontWeight: '500',
  },

  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },

  textoVazio: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },

  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});