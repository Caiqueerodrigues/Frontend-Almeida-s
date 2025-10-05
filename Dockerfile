# Imagem base
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Build da aplicação
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Inicia o servidor Nuxt
CMD ["npm", "start"]