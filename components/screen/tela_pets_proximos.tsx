import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebaseConfig';
import MenuLateral from '../navigation/menu_lateral';

type Animal = {
  id: string;
  nomeAnimal: string;
  fotoBase64?: string;
  especie?: string;
  porte?: string;
  idade?: string;
  latitude?: number;
  longitude?: number;
  localizacaoTexto?: string;
  disponivel?: boolean;
  removido?: boolean;
};

type FiltroDistancia = 'todos' | 5 | 10 | 15 | 20;

export default function TelaPetsProximos() {
  const router = useRouter();

  const [localizacaoUsuario, setLocalizacaoUsuario] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<FiltroDistancia>('todos');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Permita o acesso à localização para ver pets próximos.'
        );
        return;
      }

      const localizacao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocalizacaoUsuario({
        latitude: localizacao.coords.latitude,
        longitude: localizacao.coords.longitude,
      });

      const q = query(
        collection(db, 'animais'),
        where('disponivel', '==', true)
      );

      const snapshot = await getDocs(q);

      const lista = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Animal, 'id'>),
        }))
        .filter(
          (animal) =>
            animal.removido !== true &&
            typeof animal.latitude === 'number' &&
            typeof animal.longitude === 'number'
        );

      setAnimais(lista);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível carregar o mapa.'
      );
    } finally {
      setCarregando(false);
    }
  }

  function calcularDistanciaKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371;
    const dLat = grausParaRad(lat2 - lat1);
    const dLon = grausParaRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(grausParaRad(lat1)) *
        Math.cos(grausParaRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function grausParaRad(valor: number) {
    return valor * (Math.PI / 180);
  }

  const animaisFiltrados = useMemo(() => {
    if (!localizacaoUsuario) return animais;

    if (filtro === 'todos') return animais;

    return animais.filter((animal) => {
      const distancia = calcularDistanciaKm(
        localizacaoUsuario.latitude,
        localizacaoUsuario.longitude,
        animal.latitude!,
        animal.longitude!
      );

      return distancia <= filtro;
    });
  }, [animais, filtro, localizacaoUsuario]);

  if (carregando || !localizacaoUsuario) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#88c9bf" />
        <Text style={styles.textoCarregando}>Carregando mapa...</Text>
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

            <Text style={styles.titulo}>Pets próximos</Text>

            <View style={{ width: 24 }} />
          </View>

          <View style={styles.filtros}>
            {(['todos', 5, 10, 15, 20] as FiltroDistancia[]).map((item) => (
              <TouchableOpacity
                key={String(item)}
                style={[
                  styles.filtroBotao,
                  filtro === item && styles.filtroAtivo,
                ]}
                onPress={() => setFiltro(item)}
              >
                <Text style={styles.filtroTexto}>
                  {item === 'todos' ? 'Todos' : `${item}km`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <MapView
            style={styles.mapa}
            initialRegion={{
              latitude: localizacaoUsuario.latitude,
              longitude: localizacaoUsuario.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            showsUserLocation
          >
            {animaisFiltrados.map((animal) => (
            <Marker
                key={animal.id}
                coordinate={{
                latitude: animal.latitude!,
                longitude: animal.longitude!,
                }}
                title={animal.nomeAnimal}
                description={animal.localizacaoTexto || 'Localização aproximada'}
                onCalloutPress={() =>
                router.push({
                    pathname: '/detalhe_animal' as any,
                    params: { animal: JSON.stringify(animal) },
                })
                }
            >
                <View style={styles.marker} collapsable = {false}>
                {animal.fotoBase64 ? (
                    <Image
                    source={{ uri: animal.fotoBase64 }}
                    style={styles.markerFoto}
                    resizeMode="cover"
                    />
                ) : (
                    <Ionicons name="paw" size={24} color="#434343" />
                )}
                </View>
            </Marker>
            ))}
          </MapView>

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>
              {animaisFiltrados.length} pet(s) encontrado(s)
            </Text>
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
    fontWeight: 'bold',
    color: '#434343',
  },

  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },

  filtroBotao: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
  },

  filtroAtivo: {
    backgroundColor: '#88c9bf',
  },

  filtroTexto: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#434343',
  },

  mapa: {
    flex: 1,
  },
marker: {
  width: 62,
  height: 62,
  borderRadius: 31,
  backgroundColor: '#88c9bf',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#88c9bf',
  overflow: 'hidden',
},

markerFoto: {
  width: 60,
  height: 60,
  borderRadius: 30,
},
  
  rodape: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  rodapeTexto: {
    fontSize: 14,
    color: '#666',
  },

  centralizador: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoCarregando: {
    marginTop: 12,
    color: '#666',
  },
});