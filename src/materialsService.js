import { collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebaseConfig.js";
import { commonMaterials } from "./pricingUtils.js";

const MATERIALS_COLLECTION = "materials";

export async function fetchMaterials() {
  try {
    const materialsSnapshot = await getDocs(collection(db, MATERIALS_COLLECTION));
    if (materialsSnapshot.empty) {
      await initializeDefaultMaterials();
      return commonMaterials;
    }
    const materials = [];
    materialsSnapshot.forEach((d) => {
      const data = d.data();
      materials.push({
        id: d.id,
        name: data.name,
        description: data.description,
        pricePerGram: data.pricePerGram,
        density: data.density,
        color: data.color
      });
    });
    return materials;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return commonMaterials;
  }
}

export async function initializeDefaultMaterials() {
  try {
    const batch = [];
    for (const material of commonMaterials) {
      batch.push(setDoc(doc(db, MATERIALS_COLLECTION, material.id), material));
    }
    await Promise.all(batch);
    console.log("Default materials initialized successfully");
  } catch (error) {
    console.error("Error initializing default materials:", error);
  }
}

export async function updateMaterial(material) {
  try {
    await setDoc(doc(db, MATERIALS_COLLECTION, material.id), material, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating material:", error);
    return false;
  }
}

export async function addMaterial(material) {
  if (!material.id) {
    material.id = material.name.toLowerCase().replace(/\s+/g, '-');
  }
  try {
    await setDoc(doc(db, MATERIALS_COLLECTION, material.id), material);
    return true;
  } catch (error) {
    console.error("Error adding material:", error);
    return false;
  }
}

export async function deleteMaterial(materialId) {
  try {
    await deleteDoc(doc(db, MATERIALS_COLLECTION, materialId));
    return true;
  } catch (error) {
    console.error("Error deleting material:", error);
    return false;
  }
}
