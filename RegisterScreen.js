import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert, CheckBox } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from './firebaseConfig'; // Importa tu archivo de configuración de Firebase

export default function RegisterScreen({ navigation }) {
  const handleFinalize = () => {
    navigation.navigate('Login',{}); // Redirige al inicio
  };
  //crea las variables necesiita
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState({
    carro: { quantity: '', rate: '' },
    moto: { quantity: '', rate: '' },
    bicicleta: { quantity: '', rate: '' },
    other: { quantity: '', rate: '' },
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegister = async () => {
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones.');
      return;
    }

    const auth = getAuth();

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const userDocRef = {
        username,
        email,
        vehicleTypes,
        createdAt: serverTimestamp(),
      };
      //guarda e usuario donde el email lo de como id
      await setDoc(doc(db, 'Usuarios/'+ userDocRef.email), userDocRef) // !! FUNCIONA MEJOR !!

      Alert.alert('Éxito', 'Usuario registrado correctamente.');
      navigation.navigate('Login');
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo ya está en uso. Intenta con otro.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo no es válido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil.';
          break;
        default:
          errorMessage = 'Hubo un error al registrar el usuario.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFinalize} style={styles.finalizeButton}>
            <Text style={styles.finalizeButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
      <Text style={styles.headerText}>Crear cuenta</Text>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña (mínimo 8 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Text style={styles.sectionTitle}>Parqueaderos</Text>
      {Object.keys(vehicleTypes).map(type => (
        <View key={type} style={styles.row}>
          <CheckBox
            value={!!vehicleTypes[type].quantity}
            onValueChange={(newValue) =>
              setVehicleTypes((prev) => ({
                ...prev,
                [type]: { ...prev[type], quantity: newValue ? '1' : '' },
              }))
            }
          />
          <Text style={styles.checkboxLabel}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          <TextInput
            placeholder="Cantidad"
            keyboardType="numeric"
            value={vehicleTypes[type].quantity}
            onChangeText={(text) =>
              setVehicleTypes((prev) => ({
                ...prev,
                [type]: { ...prev[type], quantity: text },
              }))
            }
            style={styles.smallInput}
          />
          <TextInput
            placeholder="Valor minuto"
            keyboardType="numeric"
            value={vehicleTypes[type].rate}
            onChangeText={(text) =>
              setVehicleTypes((prev) => ({
                ...prev,
                [type]: { ...prev[type], rate: text },
              }))
            }
            style={styles.smallInput}
          />
        </View>
      ))}
      <View style={styles.row}>
        <CheckBox
          value={termsAccepted}
          onValueChange={setTermsAccepted}
        />
        <Text style={styles.checkboxLabel}>Acepto términos</Text>
        <TouchableOpacity onPress={() => alert('Términos y Condiciones')}>
          <Text style={styles.linkText}>Leer T&C's</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Crear usuario</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4fa',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  smallInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  linkText: {
    color: '#b197fc',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#5DADE2',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  finalizeButton: { backgroundColor: '#5DADE2', padding:'1%', alignItems: 'center', borderRadius: 5, width: '15%', position: 'absolute',
    right: '10px'},
  finalizeButtonText: { color: '#FFFFFF', fontSize: 16,alignContent:'center' },
});
