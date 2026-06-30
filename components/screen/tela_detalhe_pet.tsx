import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { db } from '../firebaseConfig';

type Animal = {
  id: string;
  usuarioId: string;
  nomeAnimal: string;
  fotoBase64?: string;
  especie?: string;
  sexo?: string;
  idade?: string;
  porte?: string;
  localizacao?: string;
  localizacaoTexto?: string;
  latitude?: number;
  longitude?: number;
  castrado?: boolean;
  vacinado?: boolean;
  vermifugado?: boolean;
  descricao?: string;
  exigencias?: string;
  necessidades?: string;
  finalidade?: string;
  disponivel?: boolean;
};

export default function TelaDetalhePet() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPet();
  }, []);

  async function carregarPet() {
    try {
      const docRef = doc(db, 'animais', id as string);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        Alert.alert('Erro', 'Pet não encontrado.');
        router.back();
        return;
      }

      const dados = snapshot.data() as Omit<Animal, 'id'>;

      setAnimal({
        ...dados,
        id: snapshot.id,
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar pet.');
    } finally {
      setCarregando(false);
    }
  }

  async function compartilharPet() {
    if (!animal) return;

    try {
      await Share.share({
        message: `Conheça ${animal.nomeAnimal}!`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function alternarDisponibilidade() {
    if (!animal) return;

    try {
      await updateDoc(doc(db, 'animais', animal.id), {
        disponivel: !animal.disponivel,
      });

      setAnimal({
        ...animal,
        disponivel: !animal.disponivel,
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar pet.');
    }
  }

  async function removerPet() {
    if (!animal) return;

    const confirmar = window.confirm(`Deseja remover ${animal.nomeAnimal}?`);

    if (!confirmar) return;

    try {
      await updateDoc(doc(db, 'animais', animal.id), {
        removido: true,
      });

      router.replace('/remover_pet_sucesso');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao remover pet.');
    }
  }

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color="#88c9bf" />
      </View>
    );
  }

  if (!animal) {
    return (
      <View style={styles.centralizador}>
        <Text>Pet não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />

      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#434343" />
        </TouchableOpacity>

        <Text style={styles.appBarTitulo}>{animal.nomeAnimal}</Text>

        <TouchableOpacity onPress={compartilharPet}>
          <Ionicons name="share-social-outline" size={24} color="#434343" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {animal.fotoBase64 ? (
          <Image source={{ uri: animal.fotoBase64 }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Ionicons name="paw-outline" size={60} color="#999" />
          </View>
        )}

        <View style={styles.conteudo}>
          <View style={styles.linha}>
            <InfoItem titulo="SEXO" valor={animal.sexo || '-'} />

            <InfoItem
              titulo="LOCALIZAÇÃO"
              valor={
                animal.localizacaoTexto ||
                animal.localizacao ||
                'Não definida'
              }
            />
          </View>

          <View style={styles.linha}>
            <InfoItem
              titulo="CASTRADO"
              valor={animal.castrado ? 'Sim' : 'Não'}
            />

            <InfoItem
              titulo="VERMIFUGADO"
              valor={animal.vermifugado ? 'Sim' : 'Não'}
            />
          </View>

          <View style={styles.linha}>
            <InfoItem
              titulo="VACINADO"
              valor={animal.vacinado ? 'Sim' : 'Não'}
            />

            <InfoItem titulo="PORTE" valor={animal.porte || '-'} />
          </View>

          <View style={styles.linha}>
            <InfoItem titulo="IDADE" valor={animal.idade || '-'} />

            <InfoItem titulo="FINALIDADE" valor={animal.finalidade || '-'} />
          </View>

          <SectionTitle titulo={`MAIS SOBRE ${animal.nomeAnimal.toUpperCase()}`} />

          <Text style={styles.textoDescricao}>
            {animal.descricao || 'Sem descrição cadastrada.'}
          </Text>

          <SectionTitle titulo="EXIGÊNCIAS DO DOADOR" />

          <Text style={styles.textoDescricao}>
            {animal.exigencias || 'Nenhuma exigência cadastrada.'}
          </Text>

          <SectionTitle titulo={`O ${animal.nomeAnimal.toUpperCase()} PRECISA DE`} />

          <Text style={styles.textoDescricao}>
            {animal.necessidades || 'Nenhuma necessidade cadastrada.'}
          </Text>

          <View style={styles.areaBotoes}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() =>
                router.push({
                  pathname: '/editar_localizacao_pet' as any,
                  params: { id: animal.id },
                })
              }
            >
              <Text style={styles.textoBotao}>ALTERAR LOCALIZAÇÃO DO PET</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botao}
              onPress={() =>
                router.push({
                  pathname: '/interessados_pet',
                  params: { id: animal.id },
                })
              }
            >
              <Text style={styles.textoBotao}>VER INTERESSADOS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao} onPress={alternarDisponibilidade}>
              <Text style={styles.textoBotao}>
                {animal.disponivel !== false ? 'OCULTAR PET' : 'MOSTRAR PET'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, styles.botaoRemover]}
              onPress={removerPet}
            >
              <Text style={styles.textoBotao}>REMOVER PET</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoItem({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoTitulo}>{titulo}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

function SectionTitle({ titulo }: { titulo: string }) {
  return <Text style={styles.sectionTitle}>{titulo}</Text>;
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

  appBarTitulo: {
    fontSize: 20,
    fontWeight: '500',
    color: '#434343',
  },

  foto: {
    width: '100%',
    height: 184,
    backgroundColor: '#DDD',
  },

  fotoPlaceholder: {
    width: '100%',
    height: 184,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  conteudo: {
    padding: 16,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  infoItem: {
    width: '48%',
  },

  infoTitulo: {
    fontSize: 12,
    color: '#589b9b',
    marginBottom: 4,
  },

  infoValor: {
    fontSize: 14,
    color: '#757575',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#434343',
    marginTop: 24,
    marginBottom: 8,
  },

  textoDescricao: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 22,
  },

  areaBotoes: {
    marginTop: 32,
    gap: 12,
    marginBottom: 40,
  },

  botao: {
    height: 44,
    backgroundColor: '#88c9bf',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoRemover: {
    backgroundColor: '#e8a5a5',
  },

  textoBotao: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#434343',
  },

  centralizador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});