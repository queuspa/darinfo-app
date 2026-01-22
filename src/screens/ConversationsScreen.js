import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { iaZapService } from '../services/iaZapService';

const ConversationsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newConversation, setNewConversation] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const username = await AsyncStorage.getItem('username');
      // Buscar conversações do IA-Zap
      const data = await iaZapService.getConversations(username);
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversações:', error);
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async () => {
    if (!newConversation.trim()) {
      Alert.alert('Erro', 'Digite um tópico para a conversação');
      return;
    }

    try {
      const username = await AsyncStorage.getItem('username');
      const conversation = {
        id: Date.now().toString(),
        username,
        topic: newConversation,
        createdAt: new Date(),
        messages: [],
      };
      
      setConversations([conversation, ...conversations]);
      setNewConversation('');
      
      // Notificar IA-Zap
      await iaZapService.sendMessage({
        username,
        message: `Conversa iniciada: ${newConversation}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao iniciar conversação');
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        navigation.navigate('Messages', { conversationId: item.id })
      }
    >
      <View>
        <Text style={styles.topicText}>{item.topic}</Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={styles.messageCount}>{item.messages?.length || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tópico da conversa"
          value={newConversation}
          onChangeText={setNewConversation}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={startConversation}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        onRefresh={loadConversations}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma conversa iniciada
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  messageCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ConversationsScreen;
