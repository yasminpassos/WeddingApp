import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Importando o SecureStore
import { Ionicons } from '@expo/vector-icons'; // Para o ícone de lixeira

const ToDoListScreen = () => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  // Função para carregar as tarefas
  const loadTasks = async () => {
    try {
      const storedTasks = await SecureStore.getItemAsync('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks)); // Carrega as tarefas
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas', error);
    }
  };

  // Função para salvar as tarefas
  const saveTasks = async () => {
    try {
      await SecureStore.setItemAsync('tasks', JSON.stringify(tasks)); // Salva as tarefas
    } catch (error) {
      console.error('Erro ao salvar tarefas', error);
    }
  };

  // Carregar as tarefas ao montar o componente
  useEffect(() => {
    loadTasks();
  }, []);

  // Salvar as tarefas sempre que a lista mudar
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleToggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    // Adiciona ou remove o risco sem alterar o texto
    updatedTasks[index] = updatedTasks[index].startsWith('✓ ') 
      ? updatedTasks[index].slice(2) 
      : `✓ ${updatedTasks[index]}`;
    setTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>

      <TextInput
        style={styles.input}
        value={newTask}
        onChangeText={setNewTask}
        placeholder="Digite uma nova tarefa"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <View style={styles.taskContainer}>
            {/* Aumentando a área de clique no texto */}
            <TouchableOpacity style={styles.taskButton} onPress={() => handleToggleTask(index)}>
              <Text style={item.startsWith('✓ ') ? styles.completedTask : styles.task}>
                {item}
              </Text>
            </TouchableOpacity>

            {/* Ícone de lixeira */}
            <TouchableOpacity onPress={() => handleDeleteTask(index)}>
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
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskButton: {
    flex: 1, // Aumenta a área de clique
    padding: 10,
  },
  task: {
    fontSize: 16,
  },
  completedTask: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
  },
});

export default ToDoListScreen;
