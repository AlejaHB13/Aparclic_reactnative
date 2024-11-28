import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

const ParkingAvailability = ({ navigation, route }) => {
   //trae el usuario con el que se incia sesion
  const a = route.params
  const ruta = a.userEmail;
   //crea las variaboles necesarias 
  const [vehicleTypes, setVehicleTypes] = useState({
    carro: { quantity: '', rate: '' },
    moto: { quantity: '', rate: '' },
    bicicleta: { quantity: '', rate: '' },
    other: { quantity: '', rate: '' },
  });

  const handleFinalize = () => {
    navigation.replace('Home', {userEmail : ruta}); // Redirige al inicio
  };
  // Cargar los datos de Firestore (si es necesario)
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        //Mostras disponibilidad con el usuario que se ingresa
        const docRef = doc(db, 'Usuarios/' + ruta);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setVehicleTypes(data.vehicleTypes); // Actualizar el estado con los datos de Firestore
        } else {
          console.log('No hay datos para este parqueadero.');
        }
      } catch (error) {
        console.error('Error al obtener los datos de Firestore: ', error);
      }
    };

    fetchParkingData(); // Obtener los datos al cargar el componente
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFinalize} style={styles.finalizeButton}>
            <Text style={styles.finalizeButtonText}>Volver al menú</Text>
          </TouchableOpacity>
      <Text style={styles.title}>Disponibilidad del Parqueadero:</Text>
      
      {/* Mostrar los datos de los vehículos */}
      {Object.keys(vehicleTypes).map((vehicleType) => (
        <View style={styles.card} key={vehicleType}>
          
          <Text style={styles.vehicleType}>{vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}</Text>
          <Text style={styles.parkingInfo}>Total de parqueaderos: {vehicleTypes[vehicleType].quantity}</Text>
          <Text style={styles.parkingInfo}>Valor por minuto: {vehicleTypes[vehicleType].rate}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  parkingInfo: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  finalizeButton: { backgroundColor: '#5DADE2', padding:'1%', alignItems: 'center', borderRadius: 5, width: '13%' },
  finalizeButtonText: { color: '#FFFFFF', fontSize: 16,alignContent:'center' },
});

export default ParkingAvailability;
