import "./firebaseConfig.js";
import { fetchMaterials } from "./materialsService.js";
import { calculatePrice, formatMAD } from "./pricingUtils.js";
import { createOrder } from "./ordersService.js";
import { notifyOrderCreated } from "./notificationService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const materialSelect = document.getElementById("materialSelect");
  const infillInput = document.getElementById("infillInput");
  const layerHeightInput = document.getElementById("layerHeightInput");
  const volumeInput = document.getElementById("volumeInput");
  const priceDisplay = document.getElementById("priceDisplay");
  const orderForm = document.getElementById("orderForm");

  const materials = await fetchMaterials();
  materials.forEach((mat) => {
    const option = document.createElement("option");
    option.value = mat.id;
    option.textContent = mat.name;
    materialSelect.appendChild(option);
  });

  function updatePrice() {
    const volume = parseFloat(volumeInput.value);
    const material = materials.find((m) => m.id === materialSelect.value);
    const infill = parseInt(infillInput.value, 10);
    const layerHeight = parseFloat(layerHeightInput.value);
    if (!material || isNaN(volume)) {
      priceDisplay.textContent = "";
      return;
    }
    const result = calculatePrice(volume, material, infill, layerHeight);
    priceDisplay.textContent = formatMAD(result.totalPrice);
  }

  materialSelect.addEventListener("change", updatePrice);
  infillInput.addEventListener("input", updatePrice);
  layerHeightInput.addEventListener("change", updatePrice);
  volumeInput.addEventListener("input", updatePrice);

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const material = materials.find((m) => m.id === materialSelect.value);
    const volume = parseFloat(volumeInput.value);
    const infill = parseInt(infillInput.value, 10);
    const layerHeight = parseFloat(layerHeightInput.value);
    const result = calculatePrice(volume, material, infill, layerHeight);

    const orderData = {
      customerName: orderForm.customerName.value,
      customerEmail: orderForm.customerEmail.value,
      materialId: material.id,
      materialName: material.name,
      fileName: orderForm.fileInput.files[0]?.name || "",
      modelVolume: volume,
      infillPercentage: infill,
      weight: result.weight,
      price: result.totalPrice,
    };

    const orderId = await createOrder(orderData);
    if (orderId) {
      notifyOrderCreated(orderId);
      orderForm.reset();
      priceDisplay.textContent = "";
    } else {
      alert("Erreur lors de la création de la commande");
    }
  });
});
