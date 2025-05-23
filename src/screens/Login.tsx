import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { jwtDecode } from 'jwt-decode';

import { login } from './services/authService';

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  CadastroRestaurante: undefined;
  MenuUsuario: undefined;
  Index: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

type DecodedToken = {
  sub: string;
  email: string;
  restaurant: boolean;
  exp: number;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    console.log('Tentando logar com:', email, password);
    try {
      console.log('Chamando login...');
      const data = await login(email, password);
      console.log('Resposta da API:', data);
      const token = data.token;

      await AsyncStorage.setItem('token', token);
      console.log('Token salvo:', token);

      const decoded: DecodedToken = jwtDecode(token);

      if (decoded.restaurant) {
        navigation.navigate('Index'); 
      } else {
        navigation.navigate('MenuUsuario'); 
      }

      Alert.alert('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro no login:', error?.response?.data || error.message);
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  };

  const navigateToCadastro = () => {
    navigation.navigate('Cadastro');
  };

  const navigateToCadastroRestaurante = () => {
    navigation.navigate('CadastroRestaurante');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.innerContainer}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('./unnamed.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Poliedro Bot</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#8B4513" />
                  ) : (
                    <Eye size={20} color="#8B4513" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.registerSection}>
              <View style={styles.registerOption}>
                <Text style={styles.registerText}>
                  Ainda não possui login de usuário?{' '}
                </Text>
                <TouchableOpacity onPress={navigateToCadastro}>
                  <Text style={styles.registerLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Ou</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.registerOption}>
                <Text style={styles.registerText}>
                  Ainda não possui login de restaurante?{' '}
                </Text>
                <TouchableOpacity onPress={navigateToCadastroRestaurante}>
                  <Text style={styles.registerLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#CD950C',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#8B4513',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFDB58',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFDB58',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#DAA520',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerSection: {
    marginTop: 30,
  },
  registerOption: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  registerText: {
    color: '#8B4513',
    fontSize: 14,
  },
  registerLink: {
    color: '#DAA520',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#CD950C',
    opacity: 0.5,
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#8B4513',
    fontWeight: 'bold',
  },
});

export default Login;


