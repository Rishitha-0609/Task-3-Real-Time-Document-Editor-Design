



1. Create project root folder

mkdir collaborative-editor
cd collaborative-editor
2. Setup backend

mkdir backend
cd backend
npm init -y
npm install express socket.io cors quill-delta
npm install --save-dev nodemon

3. Setup frontend
Go back to project root and create frontend React app:

cd ..
npx create-react-app frontend
cd frontend
npm install react-quill socket.io-client


To run backend
--> npm run dev

to run frontend
--> npm start
