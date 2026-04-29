import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Header from '../Header';
import InputField from '../InputField';
import PrimaryButton from '../PrimaryButton';
import ProfileImageBox from '../ProfileImageBox';
import SectionTitle from '../SectionTitle';

import { auth, db } from '../firebaseConfig';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function FazerCadastro() {
  // INFORMAÇÕES PESSOAIS
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  // INFORMAÇÕES DE PERFIL
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  async function cadastrarUsuario() {
    try {
      // VALIDAÇÕES
      if (!nome || !email || !senha || !confirmarSenha) {
        Alert.alert('Erro', 'Preencha os campos obrigatórios.');
        return;
      }

      if (senha !== confirmarSenha) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }

      // CRIA USUÁRIO NO AUTH
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const uid = credencial.user.uid;

      // SALVA DADOS NO FIRESTORE
      await setDoc(doc(db, 'usuarios', uid), {
        nome,
        idade,
        email,
        estado,
        cidade,
        endereco,
        telefone,
        usuario,
        criadoEm: new Date(),
        animais: []
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');

      // LIMPA CAMPOS
      setNome('');
      setIdade('');
      setEmail('');
      setEstado('');
      setCidade('');
      setEndereco('');
      setTelefone('');
      setUsuario('');
      setSenha('');
      setConfirmarSenha('');

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

      {/* HEADER */}
      <Header />

      {/* TEXTO INFORMATIVO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.
        </Text>
      </View>

      {/* SEÇÃO 1 */}
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

      {/* SEÇÃO 2 */}
      <View style={styles.section}>
        <SectionTitle title="INFORMAÇÕES DE PERFIL" color="#88c9bf" />

        <InputField placeholder="Nome de usuário" value={usuario} onChangeText={setUsuario} />
        <InputField placeholder="Senha" secure value={senha} onChangeText={setSenha} />
        <InputField placeholder="Confirmação de senha" secure value={confirmarSenha} onChangeText={setConfirmarSenha} />
      </View>

      {/* FOTO */}
      <View style={styles.section}>
        <SectionTitle title="FOTO DE PERFIL" color="#88c9bf" />
        <ProfileImageBox />
      </View>

      {/* BOTÃO */}
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
})
