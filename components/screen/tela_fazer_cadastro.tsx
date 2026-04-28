import { ScrollView, Text, StyleSheet, View } from 'react-native';

import Header from '../Header';
import InputField from '../InputField';
import SectionTitle from '../SectionTitle';
import PrimaryButton from '../PrimaryButton';
import ProfileImageBox from '../ProfileImageBox';

export default function FazerCadastro() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* HEADER */}
      <Header />

      {/* TEXTO INFORMATIVO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.
        </Text>
      </View>

      {/* SEÇÃO 1 */}
      <View style={[styles.section, { marginTop: 24 }]}>
        <SectionTitle title="INFORMAÇÕES PESSOAIS" color="#88c9bf" />

        <InputField placeholder="Nome completo" />
        <InputField placeholder="Idade" />
        <InputField placeholder="E-mail" />
        <InputField placeholder="Estado" />
        <InputField placeholder="Cidade" />
        <InputField placeholder="Endereço" />
        <InputField placeholder="Telefone" />
      </View>

      {/* SEÇÃO 2 */}
      <View style={styles.section}>
        <SectionTitle title="INFORMAÇÕES DE PERFIL" color="#88c9bf" />

        <InputField placeholder="Nome de usuário" />
        <InputField placeholder="Senha" secure />
        <InputField placeholder="Confirmação de senha" secure />
      </View>

      {/* FOTO */}
      <View style={styles.section}>
        <SectionTitle title="FOTO DE PERFIL" color="#88c9bf" />
        <ProfileImageBox />
      </View>

      {/* BOTÃO */}
      <PrimaryButton title="FAZER CADASTRO" color="#88c9bf" />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    paddingBottom: 32,
  },
  infoBox: {
    backgroundColor: '#cfe9e5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#434343',
    lineHeight: 20,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
});
