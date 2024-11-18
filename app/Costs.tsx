import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para os ícones
import * as SecureStore from 'expo-secure-store'; // Para armazenar dados de maneira segura
import * as FileSystem from 'expo-file-system'; // Para manipulação de arquivos
import * as Sharing from 'expo-sharing'; // Para compartilhar o arquivo

const CostListScreen = () => {
  const [newProfessional, setNewProfessional] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [professionals, setProfessionals] = useState<{ name: string; total: number; paid: number }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Estado para controlar o índice do profissional sendo editado
  const [newAmountPaid, setNewAmountPaid] = useState<string>('');

  // Função para carregar os profissionais do Secure Store
  const loadProfessionals = async () => {
    try {
      const savedProfessionals = await SecureStore.getItemAsync('professionals');
      if (savedProfessionals) {
        setProfessionals(JSON.parse(savedProfessionals)); // Carregar os profissionais armazenados
      }
    } catch (error) {
      console.error('Erro ao carregar os profissionais:', error);
    }
  };

  // Função para salvar os profissionais no Secure Store
  const saveProfessionals = async (professionals: { name: string; total: number; paid: number }[]) => {
    try {
      await SecureStore.setItemAsync('professionals', JSON.stringify(professionals)); // Salvar como string JSON
    } catch (error) {
      console.error('Erro ao salvar os profissionais:', error);
    }
  };

  // Carregar os profissionais quando o componente for montado
  useEffect(() => {
    loadProfessionals();
  }, []);

  // Função para adicionar um profissional
  const handleAddProfessional = () => {
    if (newProfessional.trim() && totalAmount.trim() && amountPaid.trim()) {
      const updatedProfessionals = [
        ...professionals,
        {
          name: newProfessional.trim(),
          total: parseFloat(totalAmount),
          paid: parseFloat(amountPaid),
        },
      ];
      setProfessionals(updatedProfessionals);
      saveProfessionals(updatedProfessionals); // Salvar a lista de profissionais
      setNewProfessional('');
      setTotalAmount('');
      setAmountPaid('');
    }
  };

  // Função para excluir um profissional
  const handleDeleteProfessional = (index: number) => {
    const updatedProfessionals = professionals.filter((_, i) => i !== index);
    setProfessionals(updatedProfessionals);
    saveProfessionals(updatedProfessionals); // Salvar a lista de profissionais
  };

  // Função para editar o valor pago de um profissional
  const handleEditAmountPaid = (index: number) => {
    setEditingIndex(index); // Definir o índice do profissional a ser editado
    setNewAmountPaid(professionals[index].paid.toString()); // Definir o valor pago para edição
  };

  // Função para salvar a edição do valor pago
  const handleSaveAmountPaid = () => {
    if (editingIndex !== null && newAmountPaid.trim()) {
      const updatedProfessionals = [...professionals];
      updatedProfessionals[editingIndex].paid = parseFloat(newAmountPaid);
      setProfessionals(updatedProfessionals);
      saveProfessionals(updatedProfessionals); // Salvar a lista de profissionais
      setEditingIndex(null); // Limpar o índice de edição
      setNewAmountPaid(''); // Limpar o campo de valor pago
    }
  };

  // Função para exportar para TXT e compartilhar
  const handleExportToTxt = async () => {
    if (professionals.length === 0) {
      Alert.alert('Erro', 'Não há profissionais para exportar!');
      return;
    }

    try {
      let txtContent = 'Lista de Profissionais\n\n';
      professionals.forEach((professional, index) => {
        txtContent += `Nome: ${professional.name}\nTotal: R$ ${professional.total.toFixed(2)}\nPago: R$ ${professional.paid.toFixed(2)}\n\n`;
      });

      const totalAmount = professionals.reduce((total, professional) => total + professional.total, 0);
      const totalPaid = professionals.reduce((total, professional) => total + professional.paid, 0);

      txtContent += `Total Geral: R$ ${totalAmount.toFixed(2)}\nTotal Pago: R$ ${totalPaid.toFixed(2)}\n`;

      // Criar o arquivo em disco
      const fileUri = FileSystem.documentDirectory + 'lista_profissionais.txt';
      await FileSystem.writeAsStringAsync(fileUri, txtContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log('Arquivo TXT gerado no caminho:', fileUri);

      // Verificar se o dispositivo suporta o compartilhamento
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri); // Compartilhar o arquivo
      } else {
        Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
      }

    } catch (error) {
      console.error('Erro ao gerar o arquivo TXT', error);
      Alert.alert('Erro', 'Falha ao gerar o arquivo TXT.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Profissionais</Text>

      <TextInput
        style={styles.input}
        value={newProfessional}
        onChangeText={setNewProfessional}
        placeholder="Nome do profissional"
      />
      <TextInput
        style={styles.input}
        value={totalAmount}
        onChangeText={setTotalAmount}
        placeholder="Valor Total"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={amountPaid}
        onChangeText={setAmountPaid}
        placeholder="Valor Pago"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddProfessional}>
        <Text style={styles.addButtonText}>Adicionar Profissional</Text>
      </TouchableOpacity>

      <FlatList
        data={professionals}
        renderItem={({ item, index }) => (
          <View style={styles.professionalContainer}>
            <Text style={styles.professionalText}>{item.name}</Text>
            <Text style={styles.professionalText}>Total: R$ {item.total.toFixed(2)}</Text>
            <Text style={styles.professionalText}>Pago: R$ {item.paid.toFixed(2)}</Text>

            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => handleEditAmountPaid(index)}>
                <Ionicons name="pencil-outline" size={24} color="orange" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteProfessional(index)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {editingIndex !== null && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={newAmountPaid}
            onChangeText={setNewAmountPaid}
            placeholder="Novo valor pago"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAmountPaid}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.exportButton} onPress={handleExportToTxt}>
        <Text style={styles.exportButtonText}>Exportar para TXT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  professionalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  professionalText: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editContainer: {
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CostListScreen;
