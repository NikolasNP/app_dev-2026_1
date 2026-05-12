import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { auth, db } from '../firebaseConfig';

const Drawer = createDrawerNavigator();

function ItemMenu({ texto, onPress }: { texto: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.textoItem}>{texto}</Text>
    </TouchableOpacity>
  );
}

function ConteudoDrawer({ navigation }: any) {
  const router = useRouter();

  const [atalhosAberto, setAtalhosAberto] = useState(true);
  const [informacoesAberto, setInformacoesAberto] = useState(true);
  const [configAberto, setConfigAberto] = useState(true);

  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [fotoUsuario, setFotoUsuario] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuario() {
      const usuarioLogado = auth.currentUser;

      if (!usuarioLogado) return;

      const usuarioRef = doc(db, 'usuarios', usuarioLogado.uid);
      const usuarioSnap = await getDoc(usuarioRef);

      if (usuarioSnap.exists()) {
        const dados = usuarioSnap.data();

        setNomeUsuario(dados.nome || dados.usuario || 'Usuário');
        setFotoUsuario(dados.fotoBase64 || null);
      }
    }

    carregarUsuario();
  }, []);

  function fecharEAbrir(rota: string) {
    navigation.closeDrawer();
    router.push(rota as any);
  }

  async function sair() {
    await signOut(auth);
    navigation.closeDrawer();
    router.replace('/');
  }

  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.drawerContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {fotoUsuario ? (
          <Image source={{ uri: fotoUsuario }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetra}>
              {nomeUsuario.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.nome}>{nomeUsuario}</Text>
      </View>

      <ItemMenu texto="Meu perfil" onPress={() => fecharEAbrir('/perfil')} />
      <ItemMenu texto="Meus pets" onPress={() => fecharEAbrir('/meus_pets')} />
      <ItemMenu texto="Adotar" onPress={() => fecharEAbrir('/adotar')} />
      <ItemMenu texto="Favoritos" />
      <ItemMenu texto="Chat" />

      <TouchableOpacity
        style={styles.blocoAtalhos}
        onPress={() => setAtalhosAberto(!atalhosAberto)}
      >
        <Text style={styles.tituloBloco}>Atalhos</Text>
        <Text style={styles.seta}>{atalhosAberto ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {atalhosAberto && (
        <>
          <ItemMenu texto="Cadastrar um pet" onPress={() => fecharEAbrir('/cadastrar_animal')} />
          <ItemMenu texto="Adotar um pet" onPress={() => fecharEAbrir('/adotar')} />
        </>
      )}

      <TouchableOpacity
        style={styles.blocoInformacoes}
        onPress={() => setInformacoesAberto(!informacoesAberto)}
      >
        <Text style={styles.tituloBloco}>Informações</Text>
        <Text style={styles.seta}>{informacoesAberto ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {informacoesAberto && (
        <>
          <ItemMenu texto="Dicas" />
          <ItemMenu texto="Eventos" />
          <ItemMenu texto="Legislação" />
          <ItemMenu texto="Termo de adoção" />
          <ItemMenu texto="Histórias de adoção" />
        </>
      )}

      <TouchableOpacity
        style={styles.blocoConfiguracoes}
        onPress={() => setConfigAberto(!configAberto)}
      >
        <Text style={styles.tituloBloco}>Configurações</Text>
        <Text style={styles.seta}>{configAberto ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {configAberto && <ItemMenu texto="Privacidade" />}

      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <Text style={styles.textoSair}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function MenuLateral({
  children,
}: {
  children: (props: { abrirMenu: () => void }) => React.ReactNode;
}) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ConteudoDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        swipeEnabled: true,
        overlayColor: 'rgba(0,0,0,0.25)',
        drawerStyle: {
          width: 320,
          backgroundColor: '#F8F8F8',
        },
        sceneStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Drawer.Screen name="TelaInterna">
        {({ navigation }) =>
          children({
            abrirMenu: () => navigation.openDrawer(),
          })
        }
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
    backgroundColor: '#F6F6F6',
  },

  header: {
    backgroundColor: '#8EDDD6',
    paddingTop: 40,
    paddingBottom: 28,
    paddingHorizontal: 28,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 20,
  },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarLetra: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#88c9bf',
  },

  nome: {
    fontSize: 18,
    color: '#3D3D3D',
    fontWeight: '500',
  },

  item: {
    backgroundColor: '#F6F6F6',
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },

  textoItem: {
    fontSize: 17,
    color: '#333333',
  },

  blocoAtalhos: {
    backgroundColor: '#EFD88E',
    paddingVertical: 22,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  blocoInformacoes: {
    backgroundColor: '#CFE8E4',
    paddingVertical: 22,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  blocoConfiguracoes: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 22,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tituloBloco: {
    fontSize: 18,
    color: '#4A4A4A',
    fontWeight: '500',
  },

  seta: {
    fontSize: 18,
    color: '#7A7A7A',
  },

  botaoSair: {
    marginTop: 12,
    backgroundColor: '#8EDDD6',
    paddingVertical: 20,
    alignItems: 'center',
  },

  textoSair: {
    fontSize: 18,
    color: '#444444',
    fontWeight: '500',
  },
});