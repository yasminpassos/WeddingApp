import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, FlatList, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para o ícone de lixeira
import * as SecureStore from 'expo-secure-store'; // Para armazenar dados de maneira segura

const ContactsScreen = () => {
  const [newContact, setNewContact] = useState({ name: '', phone: '+55' }); // +55 como padrão
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([]);

  // Função para carregar os contatos do Secure Store
  const loadContacts = async () => {
    try {
      const savedContacts = await SecureStore.getItemAsync('contacts');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts)); // Carregar os contatos armazenados
      }
    } catch (error) {
      console.error('Erro ao carregar os contatos:', error);
    }
  };

  // Função para salvar os contatos no Secure Store
  const saveContacts = async (contacts: { name: string; phone: string }[]) => {
    try {
      await SecureStore.setItemAsync('contacts', JSON.stringify(contacts)); // Salvar como string JSON
    } catch (error) {
      console.error('Erro ao salvar os contatos:', error);
    }
  };

  // Carregar os contatos quando o componente for montado
  useEffect(() => {
    loadContacts();
  }, []);

  // Função para adicionar um novo contato
  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      saveContacts(updatedContacts); // Salvar os contatos atualizados
      setNewContact({ name: '', phone: '+55' }); // Resetando o campo de telefone para o padrão
    }
  };

  // Função para excluir um contato
  const handleDeleteContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    saveContacts(updatedContacts); // Salvar os contatos atualizados
  };

  // Função para abrir o WhatsApp ao clicar no número
  const handleOpenWhatsApp = (phone: string) => {
    const url = `whatsapp://send?phone=${phone}`;
    Linking.openURL(url)
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Profissionais</Text>

      <TextInput
        style={styles.input}
        value={newContact.name}
        onChangeText={(text) => setNewContact({ ...newContact, name: text })}
        placeholder="Nome do Profissional"
      />

      <TextInput
        style={styles.input}
        value={newContact.phone}
        onChangeText={(text) => setNewContact({ ...newContact, phone: '+55' + text.replace(/^(\+55)/, '') })} // Mantém +55 como prefixo
        placeholder="Número de Telefone (ex: 11999999999)"
        keyboardType="phone-pad"
        maxLength={15} // Limita o número de caracteres para o telefone
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>Adicionar Contato</Text>
      </TouchableOpacity>

      <FlatList
        data={contacts}
        renderItem={({ item, index }) => (
          <View style={styles.contactContainer}>
            <Text style={styles.contactText}>{item.name}</Text>

            <TouchableOpacity onPress={() => handleOpenWhatsApp(item.phone)}>
              <Text style={styles.phoneText}>{item.phone}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDeleteContact(index)}>
              <Ionicons name="trash-outline" size={24} color="red" style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
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
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    flex: 1,
  },
  phoneText: {
    fontSize: 16,
    color: '#008CBA',
  },
  deleteIcon: {
    marginLeft: 10, // Adiciona espaço entre o número e o ícone da lixeira
  },
});

export default ContactsScreen;
