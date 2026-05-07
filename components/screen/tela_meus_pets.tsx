import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  collection,
  doc,
  onSnapshot,
  query,
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
import MenuLateral from '../navigation/menu_lateral';

import { auth, db } from '../firebaseConfig';

type Animal = {
  id: string;

  usuarioId: string;

  nomeAnimal: string;

  fotoBase64?: string;

  finalidade?: string;

  especie?: string;

  porte?: string;

  idade?: string;

  disponivel?: boolean;

  removido?: boolean;
};

export default function TelaMeusPets() {
  const router = useRouter();

  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);

  const usuario = auth.currentUser;

  useEffect(() => {
    if (!usuario) {
      router.replace('/login');
      return;
    }

    const q = query(
      collection(db, 'animais'),
      where('usuarioId', '==', usuario.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: Animal[] = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Animal, 'id'>),
        }))
        .filter((animal) => animal.removido !== true);

      setAnimais(lista);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  async function alternarDisponibilidade(animal: Animal) {
    try {
      await updateDoc(doc(db, 'animais', animal.id), {
        disponivel: !animal.disponivel,
      });
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível atualizar o pet.'
      );
    }
  }

  if (!usuario) {
    return (
      <View style={styles.centralizador}>
        <Text style={styles.textoInfo}>
          Você precisa estar logado para acessar seus pets.
        </Text>

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.textoBotaoPrincipal}>
            IR PARA LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#88c9bf" />
      </View>
    );
  }

  function renderItem({ item }: { item: Animal }) {
    const disponivel = item.disponivel !== false;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          !disponivel && styles.cardOculto,
        ]}
        onPress={() =>
          router.push({
            pathname: '/detalhe_meu_pet',
            params: { id: item.id },
          })
        }
      >
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <Text style={styles.textoInteressados}>
            {disponivel
              ? 'PET DISPONÍVEL'
              : 'PET OCULTO'}
          </Text>

          <Ionicons
            name={
              disponivel
                ? 'eye-outline'
                : 'eye-off-outline'
            }
            size={22}
            color="#434343"
          />
        </View>

        {/* FOTO */}
        {item.fotoBase64 ? (
          <Image
            source={{ uri: item.fotoBase64 }}
            style={styles.foto}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Ionicons
              name="paw-outline"
              size={40}
              color="#999"
            />

            <Text style={styles.textoSemFoto}>
              Sem foto
            </Text>
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.cardFooter}>
          <Text style={styles.textoFinalidade}>
            {item.finalidade?.toUpperCase() ??
              'ADOÇÃO'}
          </Text>

          <Text style={styles.nomeAnimal}>
            {item.nomeAnimal}
          </Text>

          <TouchableOpacity
            style={styles.botaoOcultar}
            onPress={() =>
              alternarDisponibilidade(item)
            }
          >
            <Text style={styles.textoBotaoOcultar}>
              {disponivel
                ? 'OCULTAR PET'
                : 'MOSTRAR PET'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

    return (
    <MenuLateral>
      {({ abrirMenu }) => (
        <View style={styles.container}>
          {/* STATUS BAR */}
          <View style={styles.statusBar} />

          {/* APP BAR */}
          <View style={styles.appBar}>
            <TouchableOpacity onPress={() => router.replace('/tela_inicial')}>
              <Ionicons name="arrow-back" size={24} color="#434343" />
            </TouchableOpacity>

            <Text style={styles.appBarTitulo}>
              Meus Pets
            </Text>

            <Ionicons
              name="search"
              size={24}
              color="#434343"
            />
          </View>

          {/* LISTA */}
          {animais.length === 0 ? (
            <View style={styles.vazio}>
              <Ionicons
                name="paw-outline"
                size={64}
                color="#88c9bf"
              />

              <Text style={styles.textoVazio}>
                Você ainda não cadastrou nenhum pet.
              </Text>

              <TouchableOpacity
                style={styles.botaoPrincipal}
                onPress={() =>
                  router.push('/cadastrar_animal')
                }
              >
                <Text style={styles.textoBotaoPrincipal}>
                  CADASTRAR PET
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={animais}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.lista}
              showsVerticalScrollIndicator={false}
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

  appBarTitulo: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#434343',
  },

  lista: {
    paddingVertical: 8,
  },

  card: {
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 2,
  },

  cardOculto: {
    opacity: 0.5,
  },

  cardHeader: {
    height: 32,
    backgroundColor: '#cfe9e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  textoInteressados: {
    fontSize: 12,
    color: '#434343',
    fontWeight: '500',
  },

  foto: {
    width: '100%',
    height: 183,
    backgroundColor: '#DDD',
  },

  fotoPlaceholder: {
    width: '100%',
    height: 183,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoSemFoto: {
    marginTop: 8,
    color: '#777',
  },

  cardFooter: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  textoFinalidade: {
    fontSize: 12,
    color: '#434343',
    marginBottom: 4,
  },

  nomeAnimal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#434343',
    marginBottom: 12,
  },

  botaoOcultar: {
    alignSelf: 'flex-start',
    backgroundColor: '#88c9bf',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },

  textoBotaoOcultar: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#434343',
  },

  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },

  textoVazio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },

  botaoPrincipal: {
    backgroundColor: '#88c9bf',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 4,
  },

  textoBotaoPrincipal: {
    fontWeight: 'bold',
    color: '#434343',
  },

  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F2F2F2',
  },

  textoInfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
});