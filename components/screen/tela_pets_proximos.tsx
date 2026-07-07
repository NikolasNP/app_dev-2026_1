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
  fotoBase64Mini?: string;
  fotoBase64Original?: string;
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

const TAMANHO_MAXIMO_BASE64_MARKER = 180000;

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

  function coordenadaValida(latitude?: number, longitude?: number) {
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  function formatarImagemBase64(base64?: string) {
    if (!base64) return null;

    const imagem = base64.trim();

    if (!imagem) return null;

    if (imagem.length > TAMANHO_MAXIMO_BASE64_MARKER) {
      console.log('Imagem ignorada no marcador: Base64 muito grande.');
      return null;
    }

    if (imagem.startsWith('data:image')) {
      return imagem;
    }

    return `data:image/jpeg;base64,${imagem}`;
  }

  function obterFotoMarker(animal: Animal) {

    if (
      animal.fotoBase64Mini &&
      animal.fotoBase64Mini.length < TAMANHO_MAXIMO_BASE64_MARKER
    ) {
      return formatarImagemBase64(animal.fotoBase64Mini);
    }

    if (
      animal.fotoBase64 &&
      animal.fotoBase64.length < TAMANHO_MAXIMO_BASE64_MARKER
    ) {
      return formatarImagemBase64(animal.fotoBase64);
    }

    return null;
  }

  async function obterLocalizacaoAtual() {
    const ultimaLocalizacao = await Location.getLastKnownPositionAsync({
      maxAge: 15000,
      requiredAccuracy: 3000,
    });

    if (
      ultimaLocalizacao &&
      coordenadaValida(
        ultimaLocalizacao.coords.latitude,
        ultimaLocalizacao.coords.longitude
      )
    ) {
      console.log('Usando última localização conhecida.');
      return ultimaLocalizacao;
    }

    console.log('Obtendo localização atual.');

    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    });
  }

  async function carregarDados() {
    try {
      setCarregando(true);

      console.log('===== carregarDados iniciado =====');

      const { status } = await Location.requestForegroundPermissionsAsync();

      console.log('Permissão de localização:', status);

      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Permita o acesso à localização para ver pets próximos.'
        );

        setCarregando(false);
        return;
      }

      const localizacao = await obterLocalizacaoAtual();

      const latitudeAtual = Number(localizacao.coords.latitude);
      const longitudeAtual = Number(localizacao.coords.longitude);

      console.log('Localização:', latitudeAtual, longitudeAtual);

      if (!coordenadaValida(latitudeAtual, longitudeAtual)) {
        Alert.alert(
          'Erro',
          'A localização retornada pelo dispositivo é inválida.'
        );

        setCarregando(false);
        return;
      }

      setLocalizacaoUsuario({
        latitude: latitudeAtual,
        longitude: longitudeAtual,
      });

      console.log('Consultando animais no Firestore.');

      const q = query(
        collection(db, 'animais'),
        where('disponivel', '==', true)
      );

      const snapshot = await getDocs(q);

      console.log('Animais encontrados no Firestore:', snapshot.size);

      const lista = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Animal, 'id'>),
        }))
        .filter((animal) => {
          const valido =
            animal.removido !== true &&
            animal.disponivel === true &&
            coordenadaValida(animal.latitude, animal.longitude);

          if (!valido) {
            console.log('Animal ignorado por dados inválidos:', {
              id: animal.id,
              nomeAnimal: animal.nomeAnimal,
              latitude: animal.latitude,
              longitude: animal.longitude,
              disponivel: animal.disponivel,
              removido: animal.removido,
            });
          }

          return valido;
        });

      console.log('Animais válidos:', lista.length);

      setAnimais(lista);

      console.log('===== carregarDados finalizado =====');
    } catch (error: any) {
      console.log('ERRO AO CARREGAR MAPA');
      console.log(error);
      console.log(error?.message);

      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível carregar o mapa.'
      );
    } finally {
      setCarregando(false);
    }
  }

  function grausParaRad(valor: number) {
    return valor * (Math.PI / 180);
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

  const animaisFiltrados = useMemo(() => {
    if (!localizacaoUsuario) return animais;

    if (filtro === 'todos') return animais;

    return animais.filter((animal) => {
      if (!coordenadaValida(animal.latitude, animal.longitude)) {
        return false;
      }

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

        <Text style={styles.textoCarregando}>
          Carregando mapa...
        </Text>
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
              <Ionicons
                name="menu"
                size={24}
                color="#434343"
              />
            </TouchableOpacity>

            <Text style={styles.titulo}>
              Pets próximos
            </Text>

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
                  {item === 'todos' ? 'Todos' : `${item} km`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <MapView
            style={styles.mapa}
            showsUserLocation
            loadingEnabled
            initialRegion={{
              latitude: localizacaoUsuario.latitude,
              longitude: localizacaoUsuario.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            onMapReady={() => console.log('Mapa carregado')}
            onLayout={() => console.log('Layout do mapa pronto')}
          >
            {animaisFiltrados.map((animal) => {
              if (!coordenadaValida(animal.latitude, animal.longitude)) {
                console.log('Marcador ignorado por coordenada inválida:', animal);
                return null;
              }

              const fotoMarker = obterFotoMarker(animal);
              return (
                <Marker
                  key={animal.id}
                  coordinate={{
                      latitude: animal.latitude!,
                      longitude: animal.longitude!,
                  }}
                  title={animal.nomeAnimal}
                  description={
                      animal.localizacaoTexto ??
                      'Localização aproximada'
                  }
                  tracksViewChanges={true}
                  onPress={() =>
                      router.push({
                          pathname: '/detalhe_animal' as any,
                          params: {
                              animal: JSON.stringify(animal),
                          },
                      })
                  }
              >
              {
              fotoMarker
              ?

              <Image
                  source={{
                      uri: fotoMarker,
                  }}
                  style={{
                      width:48,
                      height:48,
                      borderRadius:24,
                      borderWidth:2,
                      borderColor:'#88c9bf',
                      backgroundColor:'#FFFFFF',
                  }}
              />

              :

              <Ionicons
                  name="paw"
                  size={40}
                  color="#E67E22"
              />

              }

              </Marker>
              );
            })}
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
