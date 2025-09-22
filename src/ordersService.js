import { collection, getDocs, doc, setDoc, addDoc, updateDoc, query, where, orderBy, limit, getDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebaseConfig.js";

const ORDERS_COLLECTION = "orders";

export const OrderStatus = {
  ORDERED: "ordered",
  IN_PRODUCTION: "in_production",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
};

export async function createOrder(orderData) {
  try {
    const now = Timestamp.now();
    const newOrder = {
      ...orderData,
      status: OrderStatus.ORDERED,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: OrderStatus.ORDERED,
          timestamp: now,
          note: "Order created"
        }
      ]
    };
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}

export async function fetchOrders(status) {
  try {
    let ordersQuery;
    if (status) {
      ordersQuery = query(collection(db, ORDERS_COLLECTION), where("status", "==", status), orderBy("createdAt", "desc"));
    } else {
      ordersQuery = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    }
    const ordersSnapshot = await getDocs(ordersQuery);
    if (ordersSnapshot.empty) return [];
    const orders = [];
    ordersSnapshot.forEach((d) => {
      const data = d.data();
      orders.push({
        id: d.id,
        ...data
      });
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function fetchOrderById(orderId) {
  try {
    const orderDoc = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
    if (!orderDoc.exists()) return null;
    const orderData = orderDoc.data();
    return { id: orderDoc.id, ...orderData };
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return null;
  }
}

export async function updateOrderStatus(orderId, newStatus, note) {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      console.error(`Order ${orderId} not found`);
      return false;
    }
    const orderData = orderDoc.data();
    const now = Timestamp.now();
    const statusEntry = {
      status: newStatus,
      timestamp: now,
      note: note || `Status updated to ${newStatus}`
    };
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: now,
      statusHistory: [...(orderData.statusHistory || []), statusEntry]
    });
    return true;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    return false;
  }
}

export async function updateOrder(orderId, updateData) {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const updates = {
      ...updateData,
      updatedAt: Timestamp.now()
    };
    await updateDoc(orderRef, updates);
    return true;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    return false;
  }
}

export async function getRecentOrders(limitCount = 5) {
  try {
    const recentOrdersQuery = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"), limit(limitCount));
    const ordersSnapshot = await getDocs(recentOrdersQuery);
    if (ordersSnapshot.empty) return [];
    const orders = [];
    ordersSnapshot.forEach((d) => {
      const data = d.data();
      orders.push({
        id: d.id,
        ...data
      });
    });
    return orders;
  } catch (error) {
    console.error(`Error fetching recent orders:`, error);
    return [];
  }
}

export async function getOrderCounts() {
  try {
    const ordersSnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const counts = {
      [OrderStatus.ORDERED]: 0,
      [OrderStatus.IN_PRODUCTION]: 0,
      [OrderStatus.COMPLETED]: 0,
      [OrderStatus.CANCELLED]: 0
    };
    ordersSnapshot.forEach((d) => {
      const data = d.data();
      counts[data.status]++;
    });
    return counts;
  } catch (error) {
    console.error("Error counting orders:", error);
    return {
      [OrderStatus.ORDERED]: 0,
      [OrderStatus.IN_PRODUCTION]: 0,
      [OrderStatus.COMPLETED]: 0,
      [OrderStatus.CANCELLED]: 0
    };
  }
}
