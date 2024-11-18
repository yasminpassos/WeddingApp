import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  const menuItems = [
    { title: 'To Do List', route: '/ToDoList' },
    { title: 'Lista de Convidados', route: '/GuestList' },
    { title: 'Custos', route: '/Costs' },
    { title: 'Profissionais', route: '/Professionals' },
    { title: 'Datas', route: '/Dates' },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);  // Apenas navega para a página
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Costa Matrimonial</Text>
      <Text style={styles.introText}>
        Aqui você pode encontrar dicas para se preparar para o seu grande dia!
      </Text>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.squareButton}
            onPress={() => handleNavigation(item.route)}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cfe0e0',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D3D47',
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
  },
  squareButton: {
    width: 140,
    height: 140,
    backgroundColor: '#8aa5a4',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
