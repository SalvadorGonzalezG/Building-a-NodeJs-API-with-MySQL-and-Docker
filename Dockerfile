# Especificamos la imagen base para el contenedor de Docker.
    FROM node:17.2.0
# Establecemos el directorio de trabajo predeterminado para el contenedor de Docker.
    WORKDIR /usr/code
# Copia el archivo "package.json" desde el host al directorio de trabajo del contenedor de Docker.
    COPY package.json .
# Ejecuta el comando npm install dentro del contenedor de Docker para instalas las dependencias.
    RUN npm install
# Copia todos los archivos del directorio actual del host al directorio de trabajo del contenedor de Docker    
    COPY . .
# Establece una variable de entorno dentro del contenedor de Docker
    ENV SERVER_PORT 5000
# Especifica que el contenedor de docker escuchara en el puerto 3000.
    EXPOSE $SERVER_PORT
# Especifica el comando que se ejecutara automaticamente cuando se crea un contenedor, apartir de imagem de Docker
# Comstruida apartir del Dockerfile. 
    CMD ["npm", "run", "dev"]