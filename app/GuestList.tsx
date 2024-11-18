import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const GuestListScreen = () => {
  const [newGuest, setNewGuest] = useState('');
  const [guests, setGuests] = useState<{ name: string; count: number }[]>([]);

  // Função para carregar os convidados do Secure Store
  const loadGuests = async () => {
    try {
      const savedGuests = await SecureStore.getItemAsync('guests');
      if (savedGuests) {
        setGuests(JSON.parse(savedGuests));
      }
    } catch (error) {
      console.error('Erro ao carregar os convidados:', error);
    }
  };

  // Função para salvar os convidados no Secure Store
  const saveGuests = async (guests: { name: string; count: number }[]) => {
    try {
      await SecureStore.setItemAsync('guests', JSON.stringify(guests));
    } catch (error) {
      console.error('Erro ao salvar os convidados:', error);
    }
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const handleAddGuest = () => {
    if (newGuest.trim()) {
      const updatedGuests = [...guests, { name: newGuest.trim(), count: 1 }];
      setGuests(updatedGuests);
      saveGuests(updatedGuests);
      setNewGuest('');
    }
  };

  const handleDeleteGuest = (index: number) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
    saveGuests(updatedGuests);
  };

  const handleIncreaseCount = (index: number) => {
    const updatedGuests = [...guests];
    updatedGuests[index].count += 1;
    setGuests(updatedGuests);
    saveGuests(updatedGuests);
  };

  const handleDecreaseCount = (index: number) => {
    const updatedGuests = [...guests];
    if (updatedGuests[index].count > 1) {
      updatedGuests[index].count -= 1;
      setGuests(updatedGuests);
      saveGuests(updatedGuests);
    }
  };

  const handleExportToTxt = async () => {
    if (guests.length === 0) {
      Alert.alert('Erro', 'Não há convidados para exportar!');
      return;
    }

    try {
      const totalGuests = guests.reduce((total, guest) => total + guest.count, 0);
      const txtContent = guests
        .map((guest, index) => `${index + 1}. ${guest.name} - ${guest.count}`)
        .join('\n');

      const finalContent = `${txtContent}\n\nTotal de convidados: ${totalGuests}`;

      const fileUri = FileSystem.documentDirectory + 'lista_convidados.txt';
      await FileSystem.writeAsStringAsync(fileUri, finalContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Erro', 'Não foi possível compartilhar o arquivo.');
      }
    } catch (error) {
      console.error('Erro ao gerar o arquivo TXT:', error);
      Alert.alert('Erro', 'Falha ao gerar o arquivo TXT.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Convidados</Text>

      <TextInput
        style={styles.input}
        value={newGuest}
        onChangeText={setNewGuest}
        placeholder="Digite o nome do convidado"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddGuest}>
        <Text style={styles.addButtonText}>Adicionar Convidado</Text>
      </TouchableOpacity>

      <FlatList
        data={guests}
        renderItem={({ item, index }) => (
          <View style={styles.guestContainer}>
            <Text style={styles.guestText}>{item.name}</Text>

            <View style={styles.countContainer}>
              <TouchableOpacity onPress={() => handleDecreaseCount(index)}>
                <Ionicons name="remove-circle-outline" size={24} color="red" />
              </TouchableOpacity>
              <Text style={styles.countText}>{item.count}</Text>
              <TouchableOpacity onPress={() => handleIncreaseCount(index)}>
                <Ionicons name="add-circle-outline" size={24} color="green" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => handleDeleteGuest(index)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text style={styles.totalText}>
        Total de convidados: {guests.reduce((total, guest) => total + guest.count, 0)}
      </Text>

      <TouchableOpacity style={styles.exportButton} onPress={handleExportToTxt}>
        <Text style={styles.exportButtonText}>Exportar Lista</Text>
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
  guestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  guestText: {
    fontSize: 16,
    flex: 1,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  countText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  exportButton: {
    backgroundColor: '#008CBA',
    padding: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  totalText: {
    fontSize: 18,
    marginVertical: 16,
  },
});

export default GuestListScreen;
