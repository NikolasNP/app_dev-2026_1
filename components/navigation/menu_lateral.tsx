import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Drawer = createDrawerNavigator();

function ItemMenu({ texto, onPress }: { texto: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.textoItem}>{texto}</Text>
    </TouchableOpacity>
  );
}

function ConteudoDrawer({ navigation }: any) {
  const [atalhosAberto, setAtalhosAberto] = useState(true);
  const [informacoesAberto, setInformacoesAberto] = useState(true);
  const [configAberto, setConfigAberto] = useState(true);

  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.drawerContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {/* FOTO DO USUÁRIO */}
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=32' }}
          style={styles.avatar}
        />
        
        {/* NOME DO USUÁRIO */}
        <Text style={styles.nome}>Bianca</Text>
      </View>

      <ItemMenu texto="Meu perfil" />
      <ItemMenu texto="Meus pets" />
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
          <ItemMenu texto="Cadastrar um pet" />
          <ItemMenu texto="Adotar um pet" />
          <ItemMenu texto="Ajudar um pet" />
          <ItemMenu texto="Apadrinhar um pet" />
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

      <TouchableOpacity
        style={styles.botaoSair}
        onPress={() => navigation.closeDrawer()}
      >
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