# Aparclic  
Una aplicación para la gestión eficiente de parqueaderos, diseñada para propietarios que necesitan optimizar la administración y control.  

## 📜 Propósito  
Aparclic permite a los propietarios de parqueaderos registrar usuarios, gestionar entradas y salidas de vehículos, calcular costos y tiempo de permanencia, y visualizar características del parqueadero.  

## 🚀 Funcionalidades  
1. **Registro de usuario**: Crea una cuenta con credenciales únicas.  
2. **Inicio de sesión**: Accede de manera segura.  
3. **Ingreso de entrada de vehículos**: Registra la entrada de un vehículo al parqueadero.  
4. **Ingreso de salida de vehículos**: Registra la salida de un vehículo y calcula su tiempo de permanencia.  
5. **Cálculo de tarifas**: Muestra el total a pagar y el tiempo de permanencia en el parqueadero.  
6. **Visualización de características del parqueadero**: Detalla el tipo de vehículos aceptados, cantidad de espacios disponibles y tarifas por minuto.  

## 📦 Estructura de la base de datos en Firebase  
### **Usuarios**  
- `usuarioId` (string, único): Identificador único del usuario.  
- `nombreUsuario` (string): Nombre de usuario (único).  
- `correo` (string): Correo electrónico del usuario.  
- `contraseña` (string, encriptado): Contraseña del usuario.  
- `tipoParqueadero` (array de objetos): Tipo(s) de vehículo(s), cantidad de espacios, y tarifas por minuto.  

### **Vehículos**  
- `vehiculoId` (string, único): Identificador único del vehículo.  
- `tipo` (string): Tipo de vehículo ("carro", "moto", "bicicleta").  
- `placa` (string): Placa o identificador del vehículo.  
- `color` (string, solo para bicicletas).  
- `horaIngreso` (timestamp): Fecha y hora de ingreso.  
- `horaSalida` (timestamp, opcional): Fecha y hora de salida.  
- `tiempoTotal` (number, calculado): Tiempo total de permanencia en minutos.  

## 🛠️ Requisitos para correr la aplicación localmente  
1. **Pre-requisitos**  
   - Node.js (v14 o superior).  
   - JDK.  
   - Expo CLI instalado globalmente:  
     ```bash
     npm install -g expo-cli
     ```  
   - Cuenta en Firebase y configuración del proyecto con Firestore habilitado.  

3. **Clonar el repositorio**  
   ```bash
   git clone [URL del repositorio]
   cd [nombre del proyecto]
   ```
4. **Instalaar dependencias**
   ```bash
     npm install
    ```
5.  **Configurar Firebase**
    Crea un proyecto en Firebase.
    Habilita Firestore y la autenticación por correo electrónico y contraseña.
    Descarga el archivo google-services.json y colócalo en la carpeta raíz del proyecto.
    Actualiza la configuración en el archivo de inicialización de Firebase dentro de tu proyecto.

6. **Correr la aplicación**
   ```bash
     expo start o npx expo start:web
    ```

## 🎨 Diseño de la interfaz
https://www.figma.com/proto/i7LuQUmtDnIir660bzbeD2/Aparclic?node-id=1-4&t=yZ9Aw2B8IP8cAo3O-1
