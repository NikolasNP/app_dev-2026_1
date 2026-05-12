import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PrimaryButton({ title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    maxWidth: 328,
    height: 80,
    backgroundColor: '#cfe9e5',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    color: '#434343',
    fontWeight: '500',
  },
});
