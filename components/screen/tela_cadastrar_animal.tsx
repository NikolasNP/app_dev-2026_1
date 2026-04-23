import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';

export default function TelaCadastrarAnimal() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.page, isDesktop && styles.pageDesktop]}>
        {/* TOPO */}
        <View style={styles.topo}>
          <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
            <Text style={styles.voltar}>←</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Cadastro do Animal</Text>
        </View>

        {/* CONTEÚDO */}
        <View style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
          <Text style={styles.subtitulo}>Tenho interesse em cadastrar o animal para:</Text>

          <View style={styles.opcoes}>
            <TouchableOpacity style={styles.botaoOpcao}>
              <Text style={styles.textoOpcao}>ADOÇÃO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoOpcao}>
              <Text style={styles.textoOpcao}>APADRINHAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoOpcaoAtivo}>
              <Text style={styles.textoOpcao}>AJUDA</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.section}>Ajudar</Text>

          <Text style={styles.label}>NOME DO ANIMAL</Text>
          <TextInput placeholder="Nome do animal" placeholderTextColor="#B5B5B5" style={styles.input} />

          <Text style={styles.label}>FOTOS DO ANIMAL</Text>
          <View style={styles.upload}>
            <Text style={styles.uploadIcon}>＋</Text>
            <Text style={styles.uploadText}>adicionar fotos</Text>
          </View>

          <Text style={styles.label}>ESPÉCIE</Text>
          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>○ Cachorro</Text>
            <Text style={styles.optionText}>○ Gato</Text>
          </View>

          <Text style={styles.label}>SEXO</Text>
          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>○ Macho</Text>
            <Text style={styles.optionText}>○ Fêmea</Text>
          </View>

          <Text style={styles.label}>PORTE</Text>
          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>○ Pequeno</Text>
            <Text style={styles.optionText}>○ Médio</Text>
            <Text style={styles.optionText}>○ Grande</Text>
          </View>

          <Text style={styles.label}>IDADE</Text>
          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>○ Filhote</Text>
            <Text style={styles.optionText}>○ Adulto</Text>
            <Text style={styles.optionText}>○ Idoso</Text>
          </View>

          <Text style={styles.label}>TEMPERAMENTO</Text>
          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>☐ Brincalhão</Text>
            <Text style={styles.optionText}>☐ Tímido</Text>
            <Text style={styles.optionText}>☐ Calmo</Text>
            <Text style={styles.optionText}>☐ Guarda</Text>
            <Text style={styles.optionText}>☐ Amoroso</Text>
            <Text style={styles.optionText}>☐ Preguiçoso</Text>
          </View>

          <Text style={styles.label}>SAÚDE</Text>
          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>☐ Vacinado</Text>
            <Text style={styles.optionText}>☐ Vermifugado</Text>
            <Text style={styles.optionText}>☐ Castrado</Text>
            <Text style={styles.optionText}>☐ Doente</Text>
          </View>

          <TextInput placeholder="Doenças do animal" placeholderTextColor="#B5B5B5" style={styles.input} />

          <Text style={styles.label}>NECESSIDADES DO ANIMAL</Text>
          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>☐ Alimento</Text>
            <Text style={styles.optionText}>☐ Auxílio financeiro</Text>
            <Text style={styles.optionText}>☐ Medicamento</Text>
          </View>

          <TextInput placeholder="Nome do medicamento" placeholderTextColor="#B5B5B5" style={styles.input} />

          <View style={styles.optionsWrap}>
            <Text style={styles.optionText}>☐ Objetos</Text>
          </View>

          <TextInput placeholder="Especifique o(s) objeto(s)" placeholderTextColor="#B5B5B5" style={styles.input} />

          <Text style={styles.label}>SOBRE O ANIMAL</Text>
          <TextInput
            placeholder="Compartilhe a história do animal"
            placeholderTextColor="#B5B5B5"
            style={[styles.input, styles.textArea]}
            multiline
          />

          <TouchableOpacity style={styles.botaoFinal}>
            <Text style={styles.textoBotaoFinal}>PROCURAR AJUDA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  scrollContent: {
    flexGrow: 1,
  },

  page: {
    flex: 1,
  },

  pageDesktop: {
    alignItems: 'center',
  },

  topo: {
    width: '100%',
    backgroundColor: '#8EDDD6',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  botaoVoltar: {
    marginRight: 10,
    paddingRight: 6,
  },

  voltar: {
    fontSize: 24,
    color: '#333',
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },

  formContainer: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 30,
  },

  formContainerDesktop: {
    paddingHorizontal: 28,
    paddingTop: 24,
  },

  subtitulo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },

  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  botaoOpcao: {
    minWidth: 110,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  botaoOpcaoAtivo: {
    minWidth: 110,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#8EDDD6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  textoOpcao: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
    textAlign: 'center',
  },

  section: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    paddingTop: 14,
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    color: '#6FA8A4',
    fontWeight: 'bold',
    fontSize: 15,
  },

  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },

  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  upload: {
    width: '100%',
    minHeight: 140,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 6,
    elevation: 2,
    padding: 16,
  },

  uploadIcon: {
    fontSize: 30,
    color: '#999',
    marginBottom: 4,
  },

  uploadText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },

  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    rowGap: 16,
    marginTop: 4,
  },

  optionText: {
    fontSize: 16,
    color: '#666',
  },

  botaoFinal: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#8EDDD6',
    marginTop: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 5,
    elevation: 3,
  },

  textoBotaoFinal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3F3F3F',
  },
});