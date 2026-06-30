import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../components/firebaseConfig';
import { enviarPush } from './notificationService';

export async function demonstrarInteresse(
  petId: string,
  interessadoId: string
) {
  const interesseExiste = await getDocs(
    query(
      collection(db, 'interesses'),
      where('petId', '==', petId),
      where('interessadoId', '==', interessadoId)
    )
  );

  if (!interesseExiste.empty) {
    return;
  }

  const pet = await getDoc(doc(db, 'pets', petId));
  const petData = pet.data();

  const interesseRef = await addDoc(collection(db, 'interesses'), {
    petId,
    donoId: petData?.donoId,
    interessadoId,
    data: Date.now(),
    status: 'novo',
  });

  const dono = await getDoc(doc(db, 'usuarios', petData?.donoId));
  const token = dono.data()?.expoPushToken;

  if (token) {
    await enviarPush(
      token,
      'Novo interesse',
      `Alguém demonstrou interesse em ${petData?.nome}`,
      {
        tipo: 'novo_interesse',
        interesseId: interesseRef.id,
        petId,
        interessadoId,
      }
    );
  }
}