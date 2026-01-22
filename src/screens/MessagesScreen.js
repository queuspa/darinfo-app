import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { iaZapService } from '../services/iaZapService';

const MessagesScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { conversationId } = route.params || {};

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // Em uma appção real, isso viria do servidor
      setMessages([]);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Erro', 'Digite uma mensagem');
      return;
    }

    try {
      const username = await AsyncStorage.getItem('username');
      const message = {
        id: Date.now().toString(),
        username,
        text: newMessage,
        timestamp: new Date(),
        sender: 'user',
      };

      setMessages([...messages, message]);
      setNewMessage('');

      // Enviar para IA-Zap
      await iaZapService.sendMessage({
        username,
        conversationId,
        message: newMessage,
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar mensagem');
    }
  };

  const uploadFile = async () => {
    try {
      // TODO: Implementar upload de arquivo
      // Usar react-native-image-picker ou react-native-document-picker
      Alert.alert('Upload', 'Selecione um arquivo para enviar');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer upload do arquivo');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.otherMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.otherBubble,
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.otherText,
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma mensagem. Comece a conversa!
            </Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={uploadFile}
        >
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 5,
  },
  userText: {
    color: '#FFF',
  },
  otherText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  attachIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sendIcon: {
    fontSize: 20,
    color: '#007AFF',
  },
});

export default MessagesScreen;
