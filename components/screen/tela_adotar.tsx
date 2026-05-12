import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../firebaseConfig';

export default function TelaAdotar() {
  const [animais, setAnimais] = useState<any[]>([]);
  const router = useRouter();

 async function buscarAnimais() {
  const snapshot = await getDocs(collection(db, 'animais'));

  const lista = snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((animal: any) => {
      return (
        animal.disponivel !== false &&
        animal.oculto !== true &&
        animal.removido !== true
      );
    });

  setAnimais(lista);
}

  useEffect(() => {
    buscarAnimais();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {animais.map((animal) => (
        <TouchableOpacity
          key={animal.id}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: '/detalhe_animal',
              params: { animal: JSON.stringify(animal) },
            })
          }
        >
          <Text style={styles.nome}>{animal.nomeAnimal}</Text>

          <Image
            source={{ uri: animal.fotoBase64 || animal.fotoUri }}
            style={styles.foto}
          />

          <View style={styles.info}>
            <Text>{animal.sexo}</Text>
            <Text>{animal.idade}</Text>
            <Text>{animal.porte}</Text>
          </View>

          <Text style={styles.local}>
            Samambaia Sul - DF
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },

  card: {
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },

  nome: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#EFD071',
  },

  foto: {
    width: '100%',
    height: 200,
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },

  local: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
});