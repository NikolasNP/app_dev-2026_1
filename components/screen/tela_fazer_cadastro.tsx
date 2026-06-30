import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Header from '../Header';
import InputField from '../InputField';
import PrimaryButton from '../PrimaryButton';
import SectionTitle from '../SectionTitle';

import { auth, db } from '../firebaseConfig';

export default function FazerCadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  async function processarImagem(uri: string) {
    const resultado = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    setFotoUri(resultado.uri);

    if (resultado.base64) {
      setFotoBase64(`data:image/jpeg;base64,${resultado.base64}`);
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
      await processarImagem(resultado.assets[0].uri);
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
      await processarImagem(resultado.assets[0].uri);
    }
  }

  async function cadastrarUsuario() {
    try {
      if (!nome || !email || !senha || !confirmarSenha) {
        Alert.alert('Erro', 'Preencha os campos obrigatórios.');
        return;
      }

      if (senha !== confirmarSenha) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }

      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const uid = credencial.user.uid;

      await setDoc(doc(db, 'usuarios', uid), {
        nome,
        idade,
        email,
        estado,
        cidade,
        endereco,
        telefone,
        usuario,
        fotoBase64: fotoBase64 || '',
        latitude: null,
        longitude: null,
        localizacaoTexto: `${cidade} - ${estado}`,
        criadoEm: new Date(),
        animaisIds: [],
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      router.replace('/tela_inicial');

    } catch (error: any) {
      console.log(error);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este e-mail já está cadastrado.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'E-mail inválido.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      } else {
        Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
      }
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.
        </Text>
      </View>

      <View style={[styles.section, { marginTop: 24 }]}>
        <SectionTitle title="INFORMAÇÕES PESSOAIS" color="#88c9bf" />

        <InputField placeholder="Nome completo" value={nome} onChangeText={setNome} />
        <InputField placeholder="Idade" value={idade} onChangeText={setIdade} />
        <InputField placeholder="E-mail" value={email} onChangeText={setEmail} />
        <InputField placeholder="Estado" value={estado} onChangeText={setEstado} />
        <InputField placeholder="Cidade" value={cidade} onChangeText={setCidade} />
        <InputField placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
        <InputField placeholder="Telefone" value={telefone} onChangeText={setTelefone} />
      </View>

      <View style={styles.section}>
        <SectionTitle title="INFORMAÇÕES DE PERFIL" color="#88c9bf" />

        <InputField placeholder="Nome de usuário" value={usuario} onChangeText={setUsuario} />
        <InputField placeholder="Senha" secure value={senha} onChangeText={setSenha} />
        <InputField placeholder="Confirmação de senha" secure value={confirmarSenha} onChangeText={setConfirmarSenha} />
      </View>

      <View style={styles.section}>
        <SectionTitle title="FOTO DE PERFIL (OPCIONAL)" color="#88c9bf" />

        {fotoBase64 ? (
          <Image source={{ uri: fotoBase64 }} style={styles.fotoPreview} />
        ) : (
          <TouchableOpacity style={styles.upload} onPress={escolherFotoGaleria}>
            <Text style={styles.uploadIcon}>＋</Text>
            <Text style={styles.uploadText}>adicionar foto</Text>
          </TouchableOpacity>
        )}

        <View style={styles.linhaBotoes}>
          <TouchableOpacity style={styles.botaoFoto} onPress={tirarFotoCamera}>
            <Text style={styles.textoBotaoFoto}>CÂMERA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoFoto} onPress={escolherFotoGaleria}>
            <Text style={styles.textoBotaoFoto}>GALERIA</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PrimaryButton
        title="FAZER CADASTRO"
        color="#88c9bf"
        onPress={cadastrarUsuario}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    paddingBottom: 32,
  },
  infoBox: {
    backgroundColor: '#cfe9e5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#434343',
    lineHeight: 20,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  upload: {
    height: 130,
    backgroundColor: '#DDDDDD',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 12,
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
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#DDD',
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  botaoFoto: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 3,
    elevation: 2,
  },
  textoBotaoFoto: {
    color: '#444',
    fontWeight: 'bold',
  },
});