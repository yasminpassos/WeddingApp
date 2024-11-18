import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Cor do ícone ativo (preto)
        tabBarActiveTintColor: 'black', 

        // Cor do ícone inativo (cinza)
        tabBarInactiveTintColor: 'gray',

        headerShown: false,
        tabBarButton: HapticTab, // Botão customizado para a tab
        tabBarBackground: TabBarBackground, // Fundo da tab
        tabBarStyle: {
          position: 'absolute', // Usando posição absoluta para a tab (somente no iOS)
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Cor do fundo da tab, um pouco transparente
          height: 60, // Ajuste do tamanho da Tab
          borderTopWidth: 0, // Removendo a borda superior
        },
        tabBarItemStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Cor padrão para a tab não selecionada
        },
        tabBarLabelStyle: {
          fontSize: 12, // Tamanho do texto no label
          fontWeight: 'bold', // Estilo do texto no label
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="contato"
        options={{
          title: 'Contatos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
