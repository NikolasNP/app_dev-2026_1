import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

type Usuario = {
  nome?: string;
  idade?: string;
  email?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
  telefone?: string;
  usuario?: string;
  fotoBase64?: string;
  animaisIds?: string[];
};

export default function TelaPerfil() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const user = auth.currentUser;

    if (!user) {
      router.replace('/login');
      return;
    }

    try {
      const ref = doc(db, 'usuarios', user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUsuario(snap.data() as Usuario);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar perfil.');
    } finally {
      setCarregando(false);
    }
  }

  async function processarImagem(uri: string) {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Erro', 'Usuário não logado.');
      return;
    }

    const resultado = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!resultado.base64) return;

    const fotoBase64 = `data:image/jpeg;base64,${resultado.base64}`;

    await updateDoc(doc(db, 'usuarios', user.uid), {
      fotoBase64,
      atualizadoEm: new Date(),
    });

    setUsuario((atual) => ({
      ...atual,
      fotoBase64,
    }));

    Alert.alert('Sucesso', 'Foto de perfil atualizada!');
  }

  async function escolherGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Permita acesso à galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      await processarImagem(resultado.assets[0].uri);
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Permita acesso à câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      await processarImagem(resultado.assets[0].uri);
    }
  }

  function escolherFoto() {
    Alert.alert(
      'Foto de perfil',
      'Escolha uma opção',
      [
        { text: 'Câmera', onPress: tirarFoto },
        { text: 'Galeria', onPress: escolherGaleria },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#88c9bf" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />

      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.replace('/tela_inicial')}>
          <Text style={styles.icone}>←</Text>
        </TouchableOpacity>

        <Text style={styles.tituloTopo}>Meu perfil</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={escolherFoto}>
          {usuario?.fotoBase64 ? (
            <Image source={{ uri: usuario.fotoBase64 }} style={styles.foto} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.letra}>
                {(usuario?.nome || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.nome}>{usuario?.nome || 'Usuário'}</Text>

        <Campo titulo="NOME COMPLETO" valor={usuario?.nome} />
        <Campo titulo="IDADE" valor={usuario?.idade ? `${usuario.idade} anos` : ''} />
        <Campo titulo="EMAIL" valor={usuario?.email} />
        <Campo
          titulo="LOCALIZAÇÃO"
          valor={
            usuario?.cidade || usuario?.estado
              ? `${usuario?.cidade || ''}${usuario?.cidade && usuario?.estado ? ' – ' : ''}${usuario?.estado || ''}`
              : ''
          }
        />
        <Campo titulo="ENDEREÇO" valor={usuario?.endereco} />
        <Campo titulo="TELEFONE" valor={usuario?.telefone} />
        <Campo titulo="NOME DE USUÁRIO" valor={usuario?.usuario} />
        <Campo
          titulo="HISTÓRICO"
          valor={`Cadastrou ${usuario?.animaisIds?.length || 0} pet(s)`}
        />

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>EDITAR PERFIL</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Campo({ titulo, valor }: { titulo: string; valor?: string }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{titulo}</Text>
      <Text style={styles.valor}>{valor || 'Não informado'}</Text>
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

  icone: {
    fontSize: 28,
    color: '#434343',
  },

  tituloTopo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#434343',
  },

  content: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 40,
    paddingHorizontal: 28,
  },

  foto: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 18,
  },

  fotoPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  letra: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#88c9bf',
  },

  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#434343',
    marginBottom: 26,
  },

  campo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 26,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#88c9bf',
    marginBottom: 4,
  },

  valor: {
    fontSize: 17,
    color: '#757575',
    textAlign: 'center',
  },

  botao: {
    width: '90%',
    backgroundColor: '#88c9bf',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 4,
    elevation: 3,
    marginTop: 10,
  },

  textoBotao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#434343',
  },

  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});