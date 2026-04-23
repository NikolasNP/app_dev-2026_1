import { Text, StyleSheet } from 'react-native';

export default function SectionTitle({ title, color="#88c9bf" }: any) {
  return <Text style={styles.text}>{title}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#88c9bf',
    marginBottom: 16, 
    fontWeight: '500',
  },
});
