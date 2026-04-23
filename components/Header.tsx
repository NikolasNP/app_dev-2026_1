import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.container}>
      <Ionicons name="menu" size={24} color="#ffffff" />
      <Text style={styles.title}>Cadastro Pessoal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    backgroundColor: '#88c9bf',
    flexDirection: 'row', // 🔥 importante
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 16, // espaço entre ícone e texto
  },
});
