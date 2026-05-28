import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { auth, db } from '../firebaseConfig';

export default function TelaEditarPerfil() {
  const router = useRouter();
  const usuario = auth.currentUser;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    if (!usuario) {
      router.replace('/login');
      return;
    }

    try {
      const ref = doc(db, 'usuarios', usuario.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const dados = snap.data();

        setNome(dados.nome || '');
        setIdade(dados.idade || '');
        setEstado(dados.estado || '');
        setCidade(dados.cidade || '');
        setEndereco(dados.endereco || '');
        setTelefone(dados.telefone || '');
        setNomeUsuario(dados.usuario || '');

        setLatitude(dados.latitude ? String(dados.latitude) : '');
        setLongitude(dados.longitude ? String(dados.longitude) : '');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar o perfil.');
    } finally {
      setCarregando(false);
    }
  }

  async function salvarPerfil() {
    if (!usuario) return;

    try {
      setSalvando(true);

      const latitudeNumber = latitude ? Number(latitude.replace(',', '.')) : null;
      const longitudeNumber = longitude ? Number(longitude.replace(',', '.')) : null;

      if (
        (latitude && Number.isNaN(latitudeNumber)) ||
        (longitude && Number.isNaN(longitudeNumber))
      ) {
        Alert.alert('Erro', 'Latitude e longitude precisam ser números válidos.');
        return;
      }

      await updateDoc(doc(db, 'usuarios', usuario.uid), {
        nome,
        idade,
        estado,
        cidade,
        endereco,
        telefone,
        usuario: nomeUsuario,

        localizacaoTexto: `${cidade} - ${estado}`,
        latitude: latitudeNumber,
        longitude: longitudeNumber,

        atualizadoEm: new Date(),
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.replace('/perfil');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o perfil.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#88c9bf" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Editar perfil</Text>

        <View style={{ width: 28 }} />
      </View>

      <View style={styles.form}>
        <Campo label="NOME COMPLETO" value={nome} onChangeText={setNome} />
        <Campo label="IDADE" value={idade} onChangeText={setIdade} />
        <Campo label="ESTADO" value={estado} onChangeText={setEstado} />
        <Campo label="CIDADE" value={cidade} onChangeText={setCidade} />
        <Campo label="ENDEREÇO FIXO" value={endereco} onChangeText={setEndereco} />
        <Campo label="TELEFONE" value={telefone} onChangeText={setTelefone} />
        <Campo label="NOME DE USUÁRIO" value={nomeUsuario} onChangeText={setNomeUsuario} />

        <Text style={styles.subtitulo}>Localização para o mapa</Text>

        <Campo
          label="LATITUDE"
          value={latitude}
          onChangeText={setLatitude}
          placeholder="Ex: -15.7939"
        />

        <Campo
          label="LONGITUDE"
          value={longitude}
          onChangeText={setLongitude}
          placeholder="Ex: -47.8828"
        />

        <Text style={styles.observacao}>
          Essa localização será usada como endereço fixo dos animais cadastrados por você.
        </Text>

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarPerfil}>
          <Text style={styles.textoBotao}>
            {salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Campo({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#AAA"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  content: {
    paddingBottom: 32,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#434343',
  },

  form: {
    padding: 24,
  },

  campo: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#88c9bf',
    marginBottom: 6,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },

  subtitulo: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#434343',
  },

  observacao: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 24,
  },

  botaoSalvar: {
    backgroundColor: '#88c9bf',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 4,
    elevation: 3,
  },

  textoBotao: {
    fontWeight: 'bold',
    color: '#434343',
  },

  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});