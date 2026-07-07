# MEAU 🐾

Aplicativo mobile desenvolvido com React Native, Expo e Firebase para facilitar o processo de adoção de animais.

## Funcionalidades

- Login e cadastro de usuários
- Cadastro de animais
- Listagem de pets disponíveis para adoção
- Visualização dos detalhes dos animais
- Perfil do usuário
- Upload de imagens pela câmera ou galeria
- Navegação por menu lateral (Drawer)

## Tecnologias

- React Native
- Expo
- Expo Router
- Firebase Authentication
- Firebase Firestore
- TypeScript
- React Navigation Drawer
- Expo Image Picker
- Expo Image Manipulator
- EAS Build

## Estrutura do Projeto

```text
app/
components/
assets/
firebaseConfig.ts
app.json
eas.json
package.json
README.md
```

## Pré-requisitos

- Node.js
- Git
- Expo CLI
- EAS CLI (para geração de APK)

## Como executar

```bash
git clone https://github.com/NikolasNP/app_dev-2026_1.git

cd app_dev-2026_1

npm install

npx expo start
```

## Gerar APK

```bash
npm install -g eas-cli

eas login

eas build --platform android --profile preview
```

## Fluxo de contribuição

```bash
git checkout -b minha-branch

git add .

git commit -m "Descrição das alterações"

git push -u origin minha-branch
```

## Integrantes

- Nome do Integrante 1
- Nome do Integrante 2
- Nome do Integrante 3
