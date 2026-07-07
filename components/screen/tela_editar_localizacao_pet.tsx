import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { auth, db } from '../firebaseConfig';

const MapView =
  Platform.OS !== 'web' ? require('react-native-maps').default : null;

const Marker =
  Platform.OS !== 'web' ? require('react-native-maps').Marker : null;

export default function TelaEditarLocalizacaoPet() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [localizacaoTexto, setLocalizacaoTexto] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarLocalizacao();
  }, []);

  function coordenadaValida(lat?: number | null, lng?: number | null) {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
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
      console.log('Usando última localização conhecida na edição.');
      return ultimaLocalizacao;
    }

    console.log('Obtendo localização atual na edição.');

    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    });
  }

  async function carregarLocalizacao() {
    const usuario = auth.currentUser;

    if (!usuario) {
      router.replace('/login');
      return;
    }

    try {
      setCarregando(true);

      console.log('===== carregarLocalizacao iniciado =====');

      const animalRef = doc(db, 'animais', String(id));
      const animalSnap = await getDoc(animalRef);

      if (!animalSnap.exists()) {
        Alert.alert('Erro', 'Animal não encontrado.');
        router.back();
        return;
      }

      const animal = animalSnap.data();

      if (animal.usuarioId !== usuario.uid) {
        Alert.alert('Erro', 'Você só pode alterar a localização dos seus pets.');
        router.back();
        return;
      }

      if (coordenadaValida(animal.latitude, animal.longitude)) {
        console.log('Usando localização salva do animal.');

        setLatitude(animal.latitude);
        setLongitude(animal.longitude);
        setLocalizacaoTexto(
          animal.localizacaoTexto || 'Localização aproximada'
        );

        return;
      }

      console.log('Animal sem localização válida. Solicitando localização.');

      const { status } = await Location.requestForegroundPermissionsAsync();

      console.log('Permissão de localização:', status);

      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permita o acesso à localização.');
        router.back();
        return;
      }

      const localizacao = await obterLocalizacaoAtual();

      const novaLatitude = Number(localizacao.coords.latitude.toFixed(3));
      const novaLongitude = Number(localizacao.coords.longitude.toFixed(3));

      if (!coordenadaValida(novaLatitude, novaLongitude)) {
        Alert.alert(
          'Erro',
          'A localização retornada pelo dispositivo é inválida.'
        );
        router.back();
        return;
      }

      console.log('Localização obtida:', novaLatitude, novaLongitude);

      setLatitude(novaLatitude);
      setLongitude(novaLongitude);
      setLocalizacaoTexto('Localização aproximada');
    } catch (error: any) {
      console.log('ERRO AO CARREGAR LOCALIZAÇÃO');
      console.log(error);
      console.log(error?.message);

      Alert.alert('Erro', error.message || 'Erro ao carregar localização.');
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarTextoLocalizacao(lat: number, lng: number) {
    if (!coordenadaValida(lat, lng)) {
      setLocalizacaoTexto('Localização aproximada');
      return;
    }

    try {
      const resultado = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (resultado.length > 0) {
        const local = resultado[0];

        const bairro =
          local.district ||
          local.subregion ||
          local.city ||
          'Localização aproximada';

        const estado = local.region || '';

        setLocalizacaoTexto(
          estado ? `${bairro} - ${estado}` : bairro
        );
      }
    } catch (error) {
      console.log('Erro no reverse geocode:', error);
      setLocalizacaoTexto('Localização aproximada');
    }
  }

  async function salvarLocalizacao() {
    if (!id || latitude === null || longitude === null) return;

    if (!coordenadaValida(latitude, longitude)) {
      Alert.alert('Erro', 'Coordenadas inválidas.');
      return;
    }

    try {
      setSalvando(true);

      const latitudeAproximada = Number(latitude.toFixed(3));
      const longitudeAproximada = Number(longitude.toFixed(3));

      await updateDoc(doc(db, 'animais', String(id)), {
        latitude: latitudeAproximada,
        longitude: longitudeAproximada,
        localizacaoTexto,
        localizacaoAtualizadaEm: new Date(),
      });

      Alert.alert('Sucesso', 'Localização do pet atualizada.');
      router.back();
    } catch (error: any) {
      console.log('ERRO AO SALVAR LOCALIZAÇÃO');
      console.log(error);
      console.log(error?.message);

      Alert.alert('Erro', error.message || 'Erro ao salvar localização.');
    } finally {
      setSalvando(false);
    }
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centralizador}>
        <Text style={styles.textoInfo}>
          O mapa funciona no aplicativo Android/iOS.
        </Text>
        <Text style={styles.textoInfo}>
          Teste pelo Development Build ou APK.
        </Text>
      </View>
    );
  }

  if (carregando || latitude === null || longitude === null) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#88c9bf" />
        <Text style={styles.textoInfo}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Localização do Pet</Text>

        <View style={{ width: 28 }} />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitulo}>Arraste o marcador</Text>

        <Text style={styles.infoTexto}>
          A localização é aproximada para proteger o endereço do usuário.
        </Text>

        <Text style={styles.localizacao}>
          {localizacaoTexto}
        </Text>
      </View>

      <MapView
        style={styles.mapa}
        loadingEnabled
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        onMapReady={() => console.log('Mapa de edição carregado')}
        onLayout={() => console.log('Layout do mapa de edição pronto')}
      >
        <Marker
          draggable
          tracksViewChanges={false}
          anchor={{
            x: 0.5,
            y: 0.5,
          }}
          coordinate={{
            latitude,
            longitude,
          }}
          title="Localização aproximada do pet"
          description={localizacaoTexto}
          onDragEnd={async (event: any) => {
            const novaLatitude = Number(
              event.nativeEvent.coordinate.latitude.toFixed(3)
            );

            const novaLongitude = Number(
              event.nativeEvent.coordinate.longitude.toFixed(3)
            );

            if (!coordenadaValida(novaLatitude, novaLongitude)) {
              Alert.alert('Erro', 'Coordenadas inválidas.');
              return;
            }

            setLatitude(novaLatitude);
            setLongitude(novaLongitude);

            await atualizarTextoLocalizacao(novaLatitude, novaLongitude);
          }}
        />
      </MapView>

      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarLocalizacao}
        disabled={salvando}
      >
        <Text style={styles.textoBotao}>
          {salvando ? 'SALVANDO...' : 'SALVAR LOCALIZAÇÃO'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
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

  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
  },

  infoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434343',
    marginBottom: 4,
  },

  infoTexto: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },

  localizacao: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5FA9A4',
  },

  mapa: {
    flex: 1,
  },

  botaoSalvar: {
    backgroundColor: '#88c9bf',
    paddingVertical: 16,
    alignItems: 'center',
  },

  textoBotao: {
    fontWeight: 'bold',
    color: '#434343',
  },

  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  textoInfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
