import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signOut } from "firebase/auth";

export default function HomeScreen({ navigation, route }) {
  
  const {userEmail} = route.params;
  const handleLogout = () => {
    const auth = getAuth();
    console.log(auth);
      signOut(auth).then(() => {
        // Sign-out successful.
        navigation.replace('Login');
    }).catch((error) => {
      // An error happened.
      Alert.alert('Error', error.message);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué desea realizar?</Text>
      <Text>Seleccione una opción</Text>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('VehicleEntry', {userEmail : userEmail})}>
        <Text style={styles.optionText}>Ingresar entrada vehículo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress = {() => navigation.replace('VehicleExit', {userEmail : userEmail})}>
        <Text style={styles.optionText}>Finalizar servicio vehículo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress = {() => navigation.replace('ParkingAvailability', { userEmail : userEmail.toString() })}>
        <Text style={styles.optionText}>Ver disponibilidad parqueadero</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  optionButton: { backgroundColor: '#5DADE2', paddingVertical: 15, width: '80%', alignItems: 'center', borderRadius: 5, marginVertical: 10 },
  optionText: { color: '#FFFFFF', fontSize: 16 },
  logoutButton: { marginTop: 20, paddingVertical: 10 },
  logoutText: { color: '#5DADE2', fontSize: 16, textDecorationLine: 'underline' }
});


