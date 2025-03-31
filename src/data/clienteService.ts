import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { Cliente } from '@/types'

const clientesRef = collection(db, 'clientes')

/**
 * Obtiene todos los clientes desde Firestore
 */
export const obtenerClientes = async (): Promise<Cliente[]> => {
  const snapshot = await getDocs(clientesRef)
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      avisado: data.avisado ?? false,
      fechaRegistro: data.fechaRegistro?.toDate().toISOString().split('T')[0] ?? '',
    }
  })
}

/**
 * Obtiene un cliente por su ID desde Firestore
 */
export const obtenerClientePorId = async (id: string): Promise<Cliente | null> => {
  const docRef = doc(db, 'clientes', id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null

  const data = docSnap.data()
  return {
    id: docSnap.id,
    nombre: data.nombre,
    telefono: data.telefono,
    email: data.email,
    avisado: data.avisado ?? false,
    fechaRegistro: data.fechaRegistro?.toDate().toISOString().split('T')[0] ?? '',
  }
}

/**
 * Crea un nuevo cliente en Firestore
 */
export const crearCliente = async (
  cliente: Omit<Cliente, 'id' | 'fechaRegistro'>
): Promise<Cliente> => {
  const docRef = await addDoc(clientesRef, {
    ...cliente,
    fechaRegistro: Timestamp.now(),
    avisado: false,
  })

  return {
    id: docRef.id,
    ...cliente,
    fechaRegistro: new Date().toISOString().split('T')[0],
    avisado: false,
  }
}

/**
 * Actualiza un cliente en Firestore
 */
export const actualizarCliente = async (
  id: string,
  datosActualizados: Partial<Omit<Cliente, 'id' | 'fechaRegistro'>>
): Promise<void> => {
  const docRef = doc(db, 'clientes', id)
  await updateDoc(docRef, datosActualizados)
}

/**
 * Elimina un cliente en Firestore
 */
export const eliminarCliente = async (id: string): Promise<void> => {
  const docRef = doc(db, 'clientes', id)
  await deleteDoc(docRef)
}
