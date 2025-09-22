export function formatMAD(amount) {
  return `${amount.toFixed(2)} MAD`;
}

export const commonMaterials = [
  {
    id: "pla",
    name: "PLA",
    description: "Acide polylactique - Biodégradable et facile à imprimer",
    pricePerGram: 0.05,
    density: 1.24,
    color: "bg-green-100",
  },
  {
    id: "abs",
    name: "ABS",
    description: "Acrylonitrile butadiène styrène - Résistant et durable",
    pricePerGram: 0.06,
    density: 1.04,
    color: "bg-orange-100",
  },
  {
    id: "petg",
    name: "PETG",
    description: "Polyéthylène téréphtalate glycol - Résistant aux chocs et à l'eau",
    pricePerGram: 0.07,
    density: 1.27,
    color: "bg-blue-100",
  },
  {
    id: "tpu",
    name: "TPU",
    description: "Polyuréthane thermoplastique - Flexible et élastique",
    pricePerGram: 0.09,
    density: 1.21,
    color: "bg-purple-100",
  },
];

export function calculatePrice(volume, material, infillPercentage, layerHeight = 0.2) {
  if (!volume || volume <= 0) {
    return { materialCost: 0, totalPrice: 0, weight: 0 };
  }

  const effectiveVolume = volume * (infillPercentage / 100);
  const weight = effectiveVolume * material.density;
  const materialCost = weight * material.pricePerGram;
  let costPerGram = 2.5;
  if (material.name.toUpperCase().includes('ABS') || material.name.toUpperCase().includes('PETG')) {
    costPerGram = 3.5;
  } else if (material.name.toUpperCase().includes('TPU')) {
    costPerGram = 5.0;
  } else if (!material.name.toUpperCase().includes('PLA')) {
    costPerGram = 4.5;
  }
  const infillFraction = infillPercentage / 100;
  const rawCost = weight * costPerGram;
  let finalPrice = rawCost;
  const qualityFactor = 1.5 - (layerHeight - 0.1) * 2.3;
  finalPrice = finalPrice * qualityFactor;
  const basePrintTimeHours = volume / 10;
  const estimatedPrintTime = basePrintTimeHours * (0.2 / layerHeight);

  return {
    materialCost: 0,
    totalPrice: parseFloat(finalPrice.toFixed(2)),
    weight: parseFloat(weight.toFixed(2)),
    estimatedPrintTime: parseFloat(estimatedPrintTime.toFixed(1))
  };
}
