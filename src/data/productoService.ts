import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { Producto } from '@/types'
import { verificarPedidosPorProducto } from './pedidoService'

const productosRef = collection(db, 'productos')

/**
 * Obtiene todos los productos desde Firestore
 */
export const obtenerProductos = async (): Promise<Producto[]> => {
  const snapshot = await getDocs(productosRef)
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: parseFloat(data.precio),
      stock: data.stock,
      creadoEn: data.creadoEn?.toDate() ?? new Date(),
    }
  })
}

/**
 * Obtiene un producto por su ID desde Firestore
 */
export const obtenerProductoPorId = async (id: string): Promise<Producto | null> => {
  const ref = doc(db, 'productos', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: parseFloat(data.precio),
    stock: data.stock,
    creadoEn: data.creadoEn?.toDate() ?? new Date(),
  }
}

/**
 * Crea un nuevo producto en Firestore
 */
export const crearProducto = async (
  producto: Omit<Producto, 'id' | 'creadoEn'>
): Promise<Producto> => {
  const docRef = await addDoc(productosRef, {
    ...producto,
    creadoEn: Timestamp.now(),
  })

  return {
    id: docRef.id,
    ...producto,
    creadoEn: new Date(),
  }
}

/**
 * Actualiza un producto y verifica si hay pedidos que se pueden satisfacer
 */
export const actualizarProducto = async (
  id: string,
  datosActualizados: Partial<Omit<Producto, 'id' | 'creadoEn'>>
): Promise<Producto | null> => {
  const ref = doc(db, 'productos', id)

  await updateDoc(ref, datosActualizados)

  const actualizado = await obtenerProductoPorId(id)
  if (!actualizado) return null

  // Si se actualizó el stock, verificar pedidos
  if (typeof datosActualizados.stock !== 'undefined') {
    verificarPedidosPorProducto(id)
  }

  return actualizado
}

/**
 * Actualiza solamente el stock de un producto y verifica pedidos
 */
export const actualizarStock = async (
  id: string,
  stock: number
): Promise<{
  producto?: Producto
  pedidosSatisfechos: ReturnType<typeof verificarPedidosPorProducto>
}> => {
  const productoActualizado = await actualizarProducto(id, { stock })

  if (!productoActualizado) {
    return { producto: undefined, pedidosSatisfechos: [] }
  }

  const pedidosSatisfechos = verificarPedidosPorProducto(id)

  return {
    producto: productoActualizado,
    pedidosSatisfechos,
  }
}

/**
 * Elimina un producto de Firestore
 */
export const eliminarProducto = async (id: string): Promise<void> => {
  const ref = doc(db, 'productos', id)
  await deleteDoc(ref)
}
