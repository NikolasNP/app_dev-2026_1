# Welcome to your Expo app 👋

This is an Expo project created with create-expo-app.

---

# 📥 Passo a passo para baixar o projeto do GitHub para o repositório local

1. Instale as ferramentas necessárias no seu computador:
   - Git → https://git-scm.com/
   - Node.js → https://nodejs.org/

2. Abra o terminal (CMD, PowerShell ou terminal do VS Code).

3. Vá até a pasta onde deseja salvar o projeto. Exemplo:

   cd D:\Projetos

4. Clone o repositório do GitHub:

   git clone https://github.com/NikolasNP/app_dev-2026_1.git

5. Entre na pasta do projeto que foi criada:

   cd app_dev-2026_1

6. Abra o projeto no VS Code (opcional):

   code .

7. Instale todas as dependências do projeto:

   npm install

8. Inicie o projeto:

   npx expo start

9. O terminal mostrará opções para abrir o aplicativo em:
   - Android Emulator
   - iOS Simulator
   - Expo Go
   - Web

---

# 🚀 Passo a passo para subir alterações para a branch main

1. Abra o terminal dentro da pasta do projeto.

2. Verifique o status dos arquivos modificados:

   git status

3. Adicione todos os arquivos modificados ou criados:

   git add .

4. Crie um commit descrevendo as alterações:

   git commit -m "Descrição das alterações realizadas"

5. Envie as alterações para o repositório remoto:

   git push origin main

Se a branch já estiver conectada ao repositório remoto, também é possível usar apenas:

   git push

---

# 🌿 Passo a passo para criar e trabalhar com branches

Criar uma nova branch:

   git checkout -b nome-da-branch

Exemplo:

   git checkout -b feature-login

Ver todas as branches existentes:

   git branch

Trocar para outra branch:

   git checkout nome-da-branch

Exemplo:

   git checkout main

Enviar uma nova branch para o GitHub:

   git push -u origin nome-da-branch

Exemplo:

   git push -u origin feature-login

Depois disso, basta usar:

   git push

para continuar enviando alterações dessa branch.

---

# 📱 Get started

1. Install dependencies

   npm install

2. Start the app

   npx expo start

You can start developing by editing the files inside the **app** directory.  
This project uses file-based routing.

---

# 🔄 Resetar o projeto

Se quiser reiniciar o projeto base do Expo:

   npm run reset-project

Esse comando move o código inicial para a pasta **app-example** e cria uma nova pasta **app** vazia.

---

# 📚 Learn more

Expo Documentation  
https://docs.expo.dev

Expo Tutorial  
https://docs.expo.dev/tutorial/introduction/

---

# 👥 Community

Expo GitHub  
https://github.com/expo/expo

Expo Discord  
https://chat.expo.dev
