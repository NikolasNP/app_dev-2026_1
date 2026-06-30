// Importa o componente Link do Expo Router.
// Ele é utilizado para navegar entre telas.
import { Link } from 'expo-router';

// Importa o StyleSheet para criar estilos no React Native.
import { StyleSheet } from 'react-native';

// Importa componentes personalizados com suporte a tema claro/escuro.
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


// Componente principal da tela modal.
export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

//tela temporária aberta sobre a aplicação.