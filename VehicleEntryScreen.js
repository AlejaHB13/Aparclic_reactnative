import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'; // Importar funciones necesarias de Firestore
import { db } from './firebaseConfig'; // Importar la configuración de Firebase

export default function VehicleEntryScreen({ navigation, route }) {
//Trae el usuario de inicio
  const {userEmail} = route.params;
  const handleFinalize2 = () => {
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

  const handleSaveEntry = async () => {
    // Validación de campos vacíos
    if (vehicleType == "Bicicleta" && !color) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      // Crear un objeto con los datos del vehículo
      const vehicleData = {
        vehicleType,
        plate,
        color: vehicleType === "Bicicleta" ? color : null, // Solo para bicicletas
        time : new Date(date.setHours(time.getHours(), time.getMinutes())),
      };
     await setDoc(doc(db, 'Vehiculos/'+ vehicleData.plate), vehicleData) // !! FUNCIONA MEJOR !!


      Alert.alert('Éxito', 'Datos guardados exitosamente');

      // Regresar a la pantalla home
      navigation.replace('Home', {userEmail : userEmail});
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      Alert.alert('Error', 'Ocurrió un error al guardar los datos');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFinalize2} style={styles.finalizeButton}>
            <Text style={styles.finalizeButtonText}>Volver el menú</Text>
          </TouchableOpacity>
      <Text style={styles.title}>Ingrese los siguientes datos:</Text>

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

      {/* Placa */}
      <Text style={styles.label}>Placa:</Text>
      <TextInput
        style={styles.input}
        placeholder="xxx"
        value={plate}
        onChangeText={setPlate}
      />

      {/* Color - Solo bicicletas */}
      {vehicleType === "Bicicleta" && (
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

      {/* Hora de Ingreso */}
      <Text style={styles.label}>Hora de ingreso y fecha:</Text>
      <View style={styles.timeContainer}>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeBox}>
          <Text style={styles.timeText}>
            {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.amPmText}>{time.getHours() >= 12 ? "PM" : "AM"}</Text>
      </View>

      {/* Selector de hora */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onTimeChange}
        />
      )}

       {/* Fecha de Ingreso */}
       <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={styles.dateText}>
          {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* Selector de fecha */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Botón de guardar */}
      <TouchableOpacity onPress={handleSaveEntry} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar ingreso</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  saveButton: { backgroundColor: '#5DADE2', padding: 15, alignItems: 'center', borderRadius: 5 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16 },
  finalizeButton: { backgroundColor: '#5DADE2', padding:'1%', alignItems: 'center', borderRadius: 5, width: '13%' },
  finalizeButtonText: { color: '#FFFFFF', fontSize: 16,alignContent:'center' },
});