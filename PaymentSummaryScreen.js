import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { db } from './firebaseConfig'; // Importa la configuración de Firestore
import { doc, getDoc } from 'firebase/firestore';

export default function PaymentSummaryScreen({ navigation, route }) {
   //trae el usuario con el que se incia sesion
  const email = route.params?.userEmail;
  //crea las variables necesarias
  const [vehicleType, setVehicleType] = useState("Carro");;
  const [totalCost, setTotalCost] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const plate = route.params?.plate;
  //trae la placa con la que se realico la finalizacion del servicio

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        // Busca el vehículo en Firestore
        const vehicleDoc = await getDoc(doc(db, 'Vehiculos/' + plate));
        if (!vehicleDoc.exists()) {
          setErrorMessage("No se encontraron datos para este vehículo.");
          return;
        }

        const vehicleData = vehicleDoc.data();

        // Calcula el tiempo total (en horas) y el costo
        const duration = vehicleData.durationHours;
        const rates = {
          Carro: 120,
          Moto: 3000, // Tarifa por hora para motos
          Bicicleta: 1000, // Tarifa por hora para bicicletas
        };
//calcula el precio por la tiempo qeu estuvo
        const total = duration * rates[vehicleType];
        setTotalTime(duration);
        setTotalCost(total.toLocaleString('es-CO'));
      } catch (error) {
        console.error("Error al obtener datos del vehículo:", error);
        setErrorMessage("Ocurrió un error al cargar los datos del servicio.");
      }
    };

    fetchVehicleData();
  }, [vehicleType, plate]);

  const handleFinalize = () => {
    navigation.replace('Home', {userEmail : email});  // Redirige al inicio
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aparclic</Text>
      <View style={styles.logoContainer}>
        <Image source={require('./imagenes/logo.png')} style={styles.logo} />
      </View>

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        <>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalAmount}>${totalCost}</Text>

          <Text style={styles.label}>Vehículo:</Text>
          <TextInput style={styles.input} value={plate} editable={false} />

          <Text style={styles.label}>Tiempo total:</Text>
          <TextInput style={styles.input} value={totalTime} editable={false} />

          <TouchableOpacity onPress={handleFinalize} style={styles.finalizeButton}>
            <Text style={styles.finalizeButtonText}>Finalizar servicio</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#5DADE2', marginBottom: 20 },
  totalLabel: { fontSize: 18, color: '#28A745', marginBottom: 5 },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#28A745', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, alignSelf: 'flex-start' },
  input: { width: '100%', borderWidth: 1, borderColor: '#CCCCCC', padding: 10, borderRadius: 5, marginBottom: 20 },
  finalizeButton: { backgroundColor: '#5DADE2', padding: 15, alignItems: 'center', borderRadius: 5, width: '100%' },
  finalizeButtonText: { color: '#FFFFFF', fontSize: 16 },
  logoContainer: {
    width: 140,
    height: 140,    
    alignItems: 'center',
    justifyContent: 'center',
    }
});