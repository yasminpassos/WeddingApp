import { StyleSheet, Image, View, TouchableOpacity, Linking, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function ContactScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Costa Matrimonial</Text>

      {/* Ícones das Redes Sociais */}
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com')}>
          <Image source={require('@/assets/icons/instagram-icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com')}>
          <Image source={require('@/assets/icons/facebook-icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/5511999999999')}>
          <Image source={require('@/assets/icons/whatsapp-icon.png')} style={[styles.icon, styles.whatsappIcon]} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

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
    marginBottom: 40,
    fontFamily: 'serif', // Estilo de fonte elegante
  },
  contactText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  icon: {
    width: 40,
    height: 40,
  },
  whatsappIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
