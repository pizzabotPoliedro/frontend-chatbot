import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  SafeAreaView 
} from 'react-native';
import { User, MessageSquare } from 'lucide-react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootStackParamList = {
  MenuUsuario: undefined;
  Pedidos: undefined;
  Cadastro: undefined;
  
};


type MenuUsuarioNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MenuUsuario'
>;

type Props = {
  navigation: MenuUsuarioNavigationProp;
};

const MenuUsuario: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCF5E5" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Qual é a pedida</Text>
          <Text style={styles.subtitle}>pra hoje?</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('TelaChat')}
          >
            <View style={styles.iconContainer}>
              <MessageSquare size={28} color="white" />
            </View>
            <Text style={styles.optionText}>Chatbot para{'\n'}pedidos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('ContaUsuario')}
          >
            <View style={styles.iconContainer}>
              <User size={28} color="white" />
            </View>
            <Text style={styles.optionText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 - Todos os direitos reservados</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF5E5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A5A00',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 32,
    color: '#B87A00',
    opacity: 0.7,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
    gap: 20,
  },
  optionButton: {
    backgroundColor: '#F9A826',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#8A5A00',
    fontSize: 12,
  },
});

export default MenuUsuario;
