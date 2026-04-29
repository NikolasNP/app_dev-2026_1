import { useRouter } from 'expo-router';
import { addDoc, arrayUnion, collection, doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { auth, db } from '../firebaseConfig';

export default function TelaCadastrarAnimal() {
  const router = useRouter();

  const [nomeAnimal, setNomeAnimal] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const [especie, setEspecie] = useState('');
  const [sexo, setSexo] = useState('');
  const [porte, setPorte] = useState('');
  const [idade, setIdade] = useState('');
  const [temperamento, setTemperamento] = useState<string[]>([]);
  const [saude, setSaude] = useState<string[]>([]);
  const [descricao, setDescricao] = useState('');

  const [carregando, setCarregando] = useState(false);

  function alternarLista(valor: string, lista: string[], setLista: (v: string[]) => void) {
    if (lista.includes(valor)) {
      setLista(lista.filter((item) => item !== valor));
    } else {
      setLista([...lista, valor]);
    }
  }

  async function escolherFotoGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Permita o acesso à galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setFotoUri(resultado.assets[0].uri);
    }
  }

  async function tirarFotoCamera() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Permita o acesso à câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setFotoUri(resultado.assets[0].uri);
    }
  }

  async function cadastrarAnimal() {
    const usuario = auth.currentUser;

    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para cadastrar um animal.');
      router.replace('/login');
      return;
    }

    if (!nomeAnimal || !fotoUri || !especie || !sexo || !porte || !idade || !descricao) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha nome, foto, espécie, sexo, porte, idade e descrição do animal.'
      );
      return;
    }

    try {
      setCarregando(true);

      const animalRef = await addDoc(collection(db, 'animais'), {
        finalidade: 'Adoção',
        nomeAnimal,
        especie,
        sexo,
        porte,
        idade,
        temperamento,
        saude,
        descricao,

        // Foto local, sem Firebase Storage
        fotoUri,

        usuarioId: usuario.uid,
        criadoEm: new Date(),
      });

      await setDoc(
        doc(db, 'usuarios', usuario.uid),
        {
          email: usuario.email,
          animaisIds: arrayUnion(animalRef.id),
          atualizadoEm: new Date(),
        },
        { merge: true }
      );

      Alert.alert('Sucesso', 'Animal cadastrado com sucesso!');
      router.back();
    } catch (error: any) {
      console.log('Erro ao cadastrar animal:', error);
      Alert.alert('Erro ao cadastrar animal', error.message || 'Erro desconhecido.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Cadastro do Animal</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.subtitulo}>Tenho interesse em cadastrar o animal para:</Text>

        <View style={styles.linhaBotoes}>
          <TouchableOpacity style={styles.botaoAtivo}>
            <Text style={styles.textoBotao}>ADOÇÃO</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.section}>Adoção</Text>

        <Text style={styles.label}>NOME DO ANIMAL</Text>
        <TextInput
          placeholder="Nome do animal"
          placeholderTextColor="#B5B5B5"
          style={styles.input}
          value={nomeAnimal}
          onChangeText={setNomeAnimal}
        />

        <Text style={styles.label}>FOTO DO ANIMAL</Text>

        {fotoUri ? (
          <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
        ) : (
          <TouchableOpacity style={styles.upload} onPress={escolherFotoGaleria}>
            <Text style={styles.uploadIcon}>＋</Text>
            <Text style={styles.uploadText}>adicionar foto</Text>
          </TouchableOpacity>
        )}

        <View style={styles.linhaBotoes}>
          <TouchableOpacity style={styles.botaoFoto} onPress={tirarFotoCamera}>
            <Text style={styles.textoBotao}>CÂMERA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoFoto} onPress={escolherFotoGaleria}>
            <Text style={styles.textoBotao}>GALERIA</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>ESPÉCIE</Text>
        <View style={styles.optionsWrap}>
          {['Cachorro', 'Gato'].map((item) => (
            <TouchableOpacity key={item} onPress={() => setEspecie(item)}>
              <Text style={styles.optionText}>
                {especie === item ? '●' : '○'} {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>SEXO</Text>
        <View style={styles.optionsWrap}>
          {['Macho', 'Fêmea'].map((item) => (
            <TouchableOpacity key={item} onPress={() => setSexo(item)}>
              <Text style={styles.optionText}>
                {sexo === item ? '●' : '○'} {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>PORTE</Text>
        <View style={styles.optionsWrap}>
          {['Pequeno', 'Médio', 'Grande'].map((item) => (
            <TouchableOpacity key={item} onPress={() => setPorte(item)}>
              <Text style={styles.optionText}>
                {porte === item ? '●' : '○'} {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>IDADE</Text>
        <View style={styles.optionsWrap}>
          {['Filhote', 'Adulto', 'Idoso'].map((item) => (
            <TouchableOpacity key={item} onPress={() => setIdade(item)}>
              <Text style={styles.optionText}>
                {idade === item ? '●' : '○'} {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>TEMPERAMENTO</Text>
        <View style={styles.optionsWrap}>
          {['Brincalhão', 'Tímido', 'Calmo', 'Guarda', 'Amoroso', 'Preguiçoso'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => alternarLista(item, temperamento, setTemperamento)}
            >
              <Text style={styles.optionText}>
                {temperamento.includes(item) ? '☑' : '☐'} {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>SAÚDE</Text>
        <View style={styles.optionsWrap}>
          {['Vacinado', 'Vermifugado', 'Castrado', 'Doente'].map((item) => (
            <TouchableOpacity key={item} onPress={() => alternarLista(item, saude, setSaude)}>
              <Text style={styles.optionText}>
                {saude.includes(item) ? '☑' : '☐'} {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>SOBRE O ANIMAL</Text>
        <TextInput
          placeholder="Compartilhe a história do animal"
          placeholderTextColor="#B5B5B5"
          style={[styles.input, styles.textArea]}
          multiline
          value={descricao}
          onChangeText={setDescricao}
        />

        <TouchableOpacity style={styles.botaoFinal} onPress={cadastrarAnimal}>
          <Text style={styles.textoBotaoFinal}>
            {carregando ? 'CADASTRANDO...' : 'CADASTRAR PARA ADOÇÃO'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor: '#8EDDD6',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voltar: {
    fontSize: 28,
    color: '#333',
    marginRight: 22,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 14,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  botaoAtivo: {
    flex: 1,
    backgroundColor: '#8EDDD6',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 3,
    elevation: 2,
  },
  botaoFoto: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 3,
    elevation: 2,
  },
  textoBotao: {
    color: '#444',
    fontWeight: 'bold',
  },
  section: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 16,
  },
  label: {
    color: '#5FA9A4',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  upload: {
    height: 130,
    backgroundColor: '#DDDDDD',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 12,
  },
  uploadIcon: {
    fontSize: 30,
    color: '#999',
  },
  uploadText: {
    color: '#888',
    fontSize: 16,
  },
  fotoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#DDD',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    rowGap: 16,
  },
  optionText: {
    color: '#666',
    fontSize: 16,
  },
  botaoFinal: {
    backgroundColor: '#8EDDD6',
    marginTop: 32,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 4,
    elevation: 3,
  },
  textoBotaoFinal: {
    color: '#333',
    fontWeight: 'bold',
  },
});