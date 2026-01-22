import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const user = await AsyncStorage.getItem('username');
      setUsername(user || '');
      // Carregar informações adicionais do usuário
      setUserInfo({
        username: user,
        email: user + '@darinfo.app',
        joinDate: new Date().toLocaleDateString('pt-BR'),
        status: 'Ativo',
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente sair?',
      [
        { text: 'Cancelár', onPress: () => {} },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('username');
              // Navigation acontece automaticamente em App.js
            } catch (error) {
              Alert.alert('Erro', 'Falha ao fazer logout');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.username}>{username || 'Usuário'}</Text>
        <Text style={styles.status}>⚡ Online</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        {userInfo && (
          <>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nome de Usuário</Text>
              <Text style={styles.infoValue}>{userInfo.username}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data de Entrada</Text>
              <Text style={styles.infoValue}>{userInfo.joinDate}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{userInfo.status}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Opções</Text>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>🔒 Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>📄 Enviar Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>ℹ️ Sobre o Darinfo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Darinfo v1.0.0</Text>
        <Text style={styles.footerText}>Sistema de Atendimento</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: '#007AFF',
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  infoSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  settingsSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 14,
    color: '#007AFF',
  },
  logoutButton: {
    marginHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfileScreen;
