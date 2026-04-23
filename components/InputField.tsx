import { View, TextInput, StyleSheet } from 'react-native';

export default function InputField({ placeholder, secure }: any) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#bdbdbd"
        secureTextEntry={secure}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16, 
  },
  input: {
    height: 32, 
    borderBottomWidth: 0.8,
    borderBottomColor: '#e6e7e8',
    fontSize: 14,
    color: '#434343',
  },
});
