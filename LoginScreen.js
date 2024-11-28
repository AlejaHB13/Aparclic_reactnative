import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from './firebaseConfig'; // Importa tu archivo de configuración de Firebase

export default function LoginScreen({ navigation }) {
     //crea las variaboles necesarias
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth();

    try {
      // Inicio de sesión en Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Obtener datos del usuario desde Firestore
      const userDocRef = doc(db, 'Usuarios/'+ email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Datos del usuario:', userData);
        // Almacenar datos 
      } else {
        console.log('El documento del usuario no existe.');
      }

      navigation.replace('Home', { userEmail: email }); 
      // Redirigir a la pantalla principal después del login guardando el usuario con el que se ingresa
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Este usuario ha sido deshabilitado.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado. Verifica tus datos.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta.';
          break;
        default:
          errorMessage = 'Hubo un error al iniciar sesión. Intenta de nuevo.';
      }
      Alert.alert('Error de inicio de sesión', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aparclic</Text>
      <View style={styles.logoContainer}>
        <Image source={require('./imagenes/logo.png')} style={styles.logo} />
      </View>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Crear cuenta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert('Si necesita recuperar la contraseña o cambiar algún dato del usuario escriba al siguiente correo: aparclic@gmail.com')}>
        <Text style={styles.forgotPassword}>Recuperar contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f0f4fa',
  },
  title: {
    fontSize: 80,
    fontWeight: 'normal', // No es 'cursive', pero puedes combinarlo con la fuente
    fontFamily: 'bold', // Fuente cursiva decorativa
    fontStyle: 'italic', // Asegura que la fuente se vea inclinada
    color: '#5DADE2',
    marginVertical: 20,
  },
  logoContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160, // Cambia al tamaño deseado
    height: 160,
    resizeMode: 'contain', // Ajusta la imagen dentro del contenedor
},
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#5DADE2',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#5DADE2',
    marginTop: 10,
  },
  forgotPassword: {
    color: '#7A7A7A', 
    marginTop: 15, 
    textDecorationLine: 'underline' 
  },
});
