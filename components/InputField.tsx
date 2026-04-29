import { StyleSheet, TextInput, View } from 'react-native';

export default function InputField({
  placeholder,
  secure,
  value,
  onChangeText
}: any) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#bdbdbd"
        secureTextEntry={secure}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
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
