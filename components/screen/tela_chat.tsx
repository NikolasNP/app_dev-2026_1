import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function TelaChat() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();

  const usuario = auth.currentUser;

  const [mensagens, setMensagens] = useState<MessageType.Any[]>([]);

  useEffect(() => {
    if (!usuario || !chatId) return;

    const mensagensRef = collection(db, 'chats', String(chatId), 'mensagens');

    const q = query(mensagensRef, orderBy('criadoEm', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: MessageType.Any[] = snapshot.docs.map((docSnap) => {
        const dados = docSnap.data();

        return {
          id: docSnap.id,
          type: 'text',
          text: dados.texto,
          author: {
            id: dados.autorId,
          },
          createdAt: dados.criadoEm?.toMillis?.() || Date.now(),
        };
      });

      setMensagens(lista);
    });

    return () => unsubscribe();
  }, [chatId]);

  async function enviarMensagem(mensagem: MessageType.PartialText) {
    if (!usuario || !chatId) return;

    await addDoc(collection(db, 'chats', String(chatId), 'mensagens'), {
      texto: mensagem.text,
      autorId: usuario.uid,
      criadoEm: serverTimestamp(),
    });

    await updateDoc(doc(db, 'chats', String(chatId)), {
      ultimaMensagem: mensagem.text,
      atualizadoEm: serverTimestamp(),
    });
  }

  if (!usuario) {
    return (
      <View style={styles.centralizador}>
        <Text>Você precisa estar logado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Chat</Text>

        <View style={{ width: 28 }} />
      </View>

      <Chat
        messages={mensagens}
        onSendPress={enviarMensagem}
        user={{ id: usuario.uid }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#434343',
  },
  centralizador: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});