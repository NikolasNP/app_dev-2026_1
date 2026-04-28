import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileImageBox() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <MaterialIcons name="control-point" size={32} color="#757575" />
      </View>
      <Text style={styles.text}>adicionar foto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 24, 
    marginBottom: 32,
  },
  box: {
    width: 128,
    height: 128,
    borderWidth: 2,
    borderColor: '#e6e7e7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 24,
    color: '#757575',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: '#757575',
  },
});
