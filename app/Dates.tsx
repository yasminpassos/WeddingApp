import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import { Calendar } from 'react-native-calendars'; 

const DateListScreen = () => {
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState<{ name: string; date: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Função para carregar os eventos do Secure Store
  const loadEvents = async () => {
    try {
      const savedEvents = await SecureStore.getItemAsync('events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents)); // Carregar eventos armazenados
      }
    } catch (error) {
      console.error('Erro ao carregar os eventos:', error);
    }
  };

  // Função para salvar os eventos no Secure Store
  const saveEvents = async (events: { name: string; date: string }[]) => {
    try {
      await SecureStore.setItemAsync('events', JSON.stringify(events)); // Salvar como string JSON
    } catch (error) {
      console.error('Erro ao salvar os eventos:', error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Função para adicionar um evento
  const handleAddEvent = () => {
    if (eventName.trim() && selectedDate) {
      const updatedEvents = [...events, { name: eventName.trim(), date: selectedDate }];
      setEvents(updatedEvents);
      saveEvents(updatedEvents); // Salvar eventos
      setEventName('');
      setSelectedDate('');
    }
  };

  // Função para excluir um evento
  const handleDeleteEvent = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    saveEvents(updatedEvents); // Salvar eventos
  };

  // Função para verificar se a data é anterior a hoje
  const isPastDate = (date: string) => {
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate < today;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datas de Compromissos</Text>

      <TextInput
        style={styles.input}
        value={eventName}
        onChangeText={setEventName}
        placeholder="Digite o nome do compromisso"
      />

      <Calendar
        style={styles.calendar}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: 'blue',
            selectedTextColor: 'white',
          },
          ...events.reduce((acc, event) => {
            const isEventPast = isPastDate(event.date);
            acc[event.date] = {
              marked: true,
              dotColor: isEventPast ? 'red' : 'green',
              activeOpacity: 0,
            };
            return acc;
          }, {}),
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.addButtonText}>Adicionar Compromisso</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        renderItem={({ item, index }) => (
          <View style={styles.eventContainer}>
            <View style={styles.eventInfo}>
              <Text style={[styles.eventText, isPastDate(item.date) && styles.pastEventText]}>
                {item.name}
              </Text>
              <Text style={[styles.eventDate, isPastDate(item.date) && styles.pastEventText]}>
                {item.date}
              </Text>
            </View>

            {/* Ícone de lixeira para deletar evento */}
            <TouchableOpacity onPress={() => handleDeleteEvent(index)}>
              <Ionicons name="trash-outline" size={24} color="red" />
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
  calendar: {
    marginBottom: 16,
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
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  eventText: {
    fontSize: 16,
    flex: 1,
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
  },
  pastEventText: {
    color: 'red',
  },
});

export default DateListScreen;
