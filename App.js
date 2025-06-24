// Importações essenciais do React e React Native
// React é a biblioteca para construir a interface, e useState é um "Hook" para gerenciar o estado do nosso app.
import React, { useState } from 'react';
// Componentes que usaremos para construir a interface visual do aplicativo.
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  Alert // Importando o Alert para substituir o 'alert' antigo.
} from 'react-native';

// --- Componente Principal: App ---
// Todo aplicativo React Native começa com um componente principal. O nosso se chama "App".
export default function App() {
  // --- Estados do Aplicativo ---
  // "useState" é como a memória de curto prazo do nosso componente.
  // Ele guarda informações que, quando mudam, fazem a tela se redesenhar automaticamente.

  // Guarda a lista de todos os vasos. Começa com uma lista vazia.
  const [vasos, setVasos] = useState([]);
  // Guarda o nome do vaso que o usuário está digitando no campo de texto.
  const [nomeVaso, setNomeVaso] = useState('');
  // Guarda a localização do vaso que o usuário está digitando.
  const [localVaso, setLocalVaso] = useState('');
  // Guarda o nome das flores que o usuário está digitando.
  const [flores, setFlores] = useState('');

  // --- Funções do Aplicativo ---

  /**
   * Adiciona um novo vaso à lista.
   * Esta função é chamada quando o usuário pressiona o botão "Adicionar Vaso".
   */
  const adicionarVaso = () => {
    // Verifica se os campos de nome e localização não estão vazios.
    // .trim() remove espaços em branco no início e no fim.
    if (nomeVaso.trim() === '' || localVaso.trim() === '') {
      // Usa o componente Alert nativo, que é a forma correta no React Native.
      Alert.alert('Atenção', 'Por favor, preencha o nome e o local do vaso.');
      return; // Para a execução da função aqui.
    }

    // Cria um novo objeto "vaso" com as informações digitadas.
    const novoVaso = {
      id: Date.now().toString(), // Cria um ID único baseado na data e hora atual.
      nome: nomeVaso,
      local: localVaso,
      // Separa as flores por vírgula e remove espaços em branco de cada uma.
      // Se o campo de flores estiver vazio, cria uma lista vazia.
      flores: flores.trim() ? flores.split(',').map(flor => flor.trim()) : [],
    };

    // Atualiza a lista de vasos.
    // "setVasos" recebe uma função que nos dá o estado anterior ("vasosAtuais").
    // Retornamos uma nova lista, com o "novoVaso" adicionado no início.
    setVasos(vasosAtuais => [novoVaso, ...vasosAtuais]);

    // Limpa os campos de texto para que o usuário possa adicionar um novo vaso.
    setNomeVaso('');
    setLocalVaso('');
    setFlores('');
    // "Keyboard.dismiss()" fecha o teclado do celular, melhorando a experiência do usuário.
    Keyboard.dismiss();
  };

  /**
   * Pede confirmação e remove um vaso da lista com base no seu ID.
   * @param {string} id - O ID do vaso a ser removido.
   */
  const removerVaso = (id) => {
    Alert.alert(
      "Remover Vaso",
      "Você tem certeza que deseja remover este vaso?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sim, Remover", 
          onPress: () => {
            // "setVasos" é chamado para atualizar a lista.
            setVasos(vasosAtuais => {
              // "filter" cria uma nova lista contendo apenas os vasos
              // cujo ID é DIFERENTE do ID que queremos remover.
              return vasosAtuais.filter(vaso => vaso.id !== id);
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  // --- Renderização da Interface ---
  // A função "return" descreve como será a aparência do nosso aplicativo.
  // Usamos os componentes que importamos lá no início.
  return (
    // SafeAreaView garante que o conteúdo não fique escondido atrás de áreas do sistema (como o "notch" do iPhone).
    <SafeAreaView style={styles.container}>
      {/* TouchableWithoutFeedback permite fechar o teclado ao tocar em qualquer lugar fora dos campos de texto */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
          {/* Título do Aplicativo */}
          <Text style={styles.title}>Meu Catálogo de Vasos</Text>

          {/* Seção do Formulário para adicionar novos vasos */}
          <View style={styles.form}>
            <Text style={styles.label}>Nome do Vaso</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Vaso de cerâmica da sala"
              placeholderTextColor="#999"
              value={nomeVaso}
              onChangeText={setNomeVaso} // Atualiza o estado "nomeVaso" a cada letra digitada.
            />

            <Text style={styles.label}>Localização</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Sala de Estar"
              placeholderTextColor="#999"
              value={localVaso}
              onChangeText={setLocalVaso} // Atualiza o estado "localVaso".
            />

            <Text style={styles.label}>Flores (separadas por vírgula)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Rosas, Lírios, Tulipas"
              placeholderTextColor="#999"
              value={flores}
              onChangeText={setFlores} // Atualiza o estado "flores".
            />

            {/* Botão para adicionar o vaso */}
            <TouchableOpacity style={styles.button} onPress={adicionarVaso}>
              <Text style={styles.buttonText}>Adicionar Vaso</Text>
            </TouchableOpacity>
          </View>

          {/* A FlatList é otimizada para mostrar listas longas de dados. */}
          {/* Ela só renderiza os itens que estão visíveis na tela. */}
          <FlatList
            data={vasos} // A fonte de dados é a nossa lista de vasos no estado.
            keyExtractor={item => item.id} // Fornece uma chave única para cada item da lista.
            renderItem={({ item }) => ( // "renderItem" define como cada item da lista será exibido.
              <View style={styles.vasoItem}>
                <View style={styles.vasoInfo}>
                  <Text style={styles.vasoNome}>{item.nome}</Text>
                  <Text style={styles.vasoLocal}>Local: {item.local}</Text>
                  {/* Verifica se existem flores antes de tentar mostrá-las */}
                  {item.flores.length > 0 && (
                    <Text style={styles.vasoFlores}>
                      Flores: {item.flores.join(', ')}
                    </Text>
                  )}
                </View>
                {/* Botão para remover o vaso */}
                <TouchableOpacity onPress={() => removerVaso(item.id)}>
                  <Text style={styles.removeButton}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
            // Mostra uma mensagem quando a lista está vazia.
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Nenhum vaso cadastrado ainda.</Text>
            )}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// --- Folha de Estilos ---
// "StyleSheet.create" ajuda a organizar e otimizar os nossos estilos.
// É semelhante ao CSS na web, mas com algumas diferenças de sintaxe.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    // Adiciona um espaçamento no topo para a barra de status do Android.
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vasoItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row', // Alinha os itens na horizontal.
    justifyContent: 'space-between', // Espaço entre os itens.
    alignItems: 'center', // Alinha verticalmente ao centro.
    borderWidth: 1,
    borderColor: '#eee',
  },
  vasoInfo: {
    flex: 1, // Permite que esta View ocupe o espaço disponível.
  },
  vasoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  vasoLocal: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  vasoFlores: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    fontStyle: 'italic',
  },
  removeButton: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    fontSize: 14,
    paddingLeft: 10, // Adiciona um espaço para não ficar colado no texto.
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#888',
  },
});
