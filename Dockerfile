
# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app
# Copia los archivos del proyecto al directorio de trabajo del contenedor
COPY package.json .

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Expone el puerto en el que la aplicación va a estar escuchando dentro del contenedor
ENV SERVER_PORT 3000

EXPOSE $SERVER_PORT
# Especifica que el contenedor de docker escuchara en el puerto 3000
#EXPOSE $PORT

# Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD ["npm", "run", "start"]