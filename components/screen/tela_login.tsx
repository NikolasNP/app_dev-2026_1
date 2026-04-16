import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function TelaLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function fazerLogin() {

    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    try {

      const usuarioCredencial = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      if (usuarioCredencial.user) {
        Alert.alert('Sucesso', 'Login realizado com sucesso');
        router.replace('/tela_inicial');
      }

    } catch (error: any) {

      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential'
      ) {
        Alert.alert('Erro', 'Login não existe');
      }

      else if (error.code === 'auth/wrong-password') {
        Alert.alert('Erro', 'Senha incorreta');
      }

      else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'Email inválido');
      }

      else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Erro', 'Muitas tentativas. Tente novamente mais tarde.');
      }

      else {
        Alert.alert('Erro', 'Não foi possível fazer login');
      }

      console.log('Erro Firebase:', error.code, error.message);
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.topo}>
        <Text style={styles.menu}>☰</Text>
        <Text style={styles.tituloTopo}>Login</Text>
      </View>

      <View style={styles.conteudo}>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#BDBDBD"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.botaoEntrar}
          onPress={fazerLogin}
        >
          <Text style={styles.botaoTexto}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoFacebook}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={styles.botaoTextoBranco}>
            IR PARA CADASTRO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoGoogle}>
          <Text style={styles.botaoTextoBranco}>
            ENTRAR COM GOOGLE
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topo: {
    backgroundColor: '#DDF5F2',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menu: {
    fontSize: 28,
    color: '#333',
    marginRight: 20,
  },

  tituloTopo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },

  conteudo: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  input: {
    width: '95%',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
    paddingVertical: 12,
    marginBottom: 28,
    color: '#333',
  },

  botaoEntrar: {
    width: '90%',
    backgroundColor: '#8EDDD6',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
    elevation: 2,
  },

  botaoFacebook: {
    width: '90%',
    backgroundColor: '#2F5EA8',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },

  botaoGoogle: {
    width: '90%',
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },

  botaoTexto: {
    fontSize: 18,
    color: '#333',
  },

  botaoTextoBranco: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },

});