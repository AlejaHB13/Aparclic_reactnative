import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from "@react-navigation/native"


export default function FinalizeServiceScreen({ navigation, route }) {
//Trae el usuario de inicio
  const {userEmail} = route.params;
  const handleFinalize = () => {
    navigation.replace('Home', {userEmail : userEmail}); // Redirige al inicio
  };

  //crea variables necesarias
  const [vehicleType, setVehicleType] = useState("Carro");
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const calculateDuration = (entryTime, i) => {
    const durationMs = (i - entryTime); 
    return Math.ceil(durationMs / 60); // Redondea hacia arriba las horas
  };

  const handleFinalizeService = async () => {
    try {
      // Busca el registro de entrada por placa o color
      const vehicleCollection = collection(db, 'Vehiculos');
      const vehicleQuery = query(
        vehicleCollection,
        where(vehicleType === 'Bicicleta' ? 'color' : 'plate', '==', vehicleType === 'Bicicleta' ? color : plate)
      );

      const querySnapshot = await getDocs(vehicleQuery);

      if (querySnapshot.empty) {
        setErrorMessage("No se encontró un registro para este vehículo.");
        return;
      }

      const vehicleDoc = querySnapshot.docs[0];
      const vehicleData = vehicleDoc.data();
      const entryTime = vehicleData.time;
      const exitTime = new Date().getTime();
      //pasa a minutos
      var i = 0 
      var residuo = exitTime%1000
      i = exitTime/1000 - residuo/1000;
      
      const durationHours = calculateDuration(entryTime.seconds, i);

      // Actualiza el documento en Firestore con los datos de salida
      await updateDoc(doc(db, 'Vehiculos/' + vehicleDoc.id), {
        exitTime,
        durationHours,
      });
      console.log(entryTime);
      console.log(entryTime.seconds);
      console.log(entryTime.seconds - 100);
      console.log(exitTime.seconds - entryTime.seconds);
      console.log(exitTime.seconds);
      console.log(exitTime);
      console.log((exitTime.miliseconds / 1000));      
      console.log(entryTime.seconds * 1000);
      console.log(exitTime/1000);
      console.log(i);
      console.log(durationHours);
      console.log(1-2);
  
      // Navega a la pantalla de resumen de pago
      navigation.replace('PaymentSummary', {vehicleType : vehicleType, plate : plate, userEmail: userEmail});
    } catch (error) {
      console.error("Error al registrar la salida:", error);
      setErrorMessage("Ocurrió un error al procesar la salida.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFinalize} style={styles.finalizeButton}>
            <Text style={styles.finalizeButtonText}>Volver el menú</Text>
          </TouchableOpacity>
      <Text style={styles.title}>Finalizar Servicio</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Tipo de Vehículo */}
      <Text style={styles.label}>Tipo de vehículo</Text>
      <Picker
        selectedValue={vehicleType}
        style={styles.picker}
        onValueChange={(itemValue) => setVehicleType(itemValue)}
      >
        <Picker.Item label="Carro" value="Carro" />
        <Picker.Item label="Moto" value="Moto" />
        <Picker.Item label="Bicicleta" value="Bicicleta" />
      </Picker>

      {/* Placa o Color */}
      {vehicleType !== "Bicicleta" ? (
        <>
          <Text style={styles.label}>Placa:</Text>
          <TextInput
            style={styles.input}
            placeholder="xxx"
            value={plate}
            onChangeText={setPlate}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Color:</Text>
          <TextInput
            style={styles.input}
            placeholder="Solo bicicletas"
            value={color}
            onChangeText={setColor}
          />
        </>
      )}

      {/* Hora de Salida */}
      <Text style={styles.label}>Hora de salida y fecha:</Text>
      <View style={styles.timeContainer}>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeBox}>
          <Text style={styles.timeText}>
            {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onTimeChange}
        />
      )}

      {/* Fecha de Salida */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Botón de Finalizar */}
      <TouchableOpacity onPress={handleFinalizeService} style={styles. nextButton}>
        <Text style={styles.nextButtonText}>Registrar salida</Text>
      </TouchableOpacity>
    </View>
  );
}

export{}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#CCCCCC', padding: 10, borderRadius: 5, marginBottom: 20 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  timeBox: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 5, alignItems: 'center' },
  timeText: { fontSize: 18 },
  amPmText: { fontSize: 18, marginLeft: 10 },
  dateText: { fontSize: 18 },
  nextButton: { backgroundColor: '#5DADE2', padding: 15, alignItems: 'center', borderRadius: 5 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16 },
  finalizeButton: { backgroundColor:'#5DADE2', padding:'1%', alignItems: 'center', borderRadius: 5, width: '13%' },
  finalizeButtonText: { color: '#FFFFFF', fontSize: 16,alignContent:'center' },
});