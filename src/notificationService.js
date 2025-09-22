// Simple toast placeholder using browser alerts
const toast = {
  success: (msg, opts) => alert(msg),
  error: (msg, opts) => alert(msg),
  info: (msg, opts) => alert(msg),
};

const statusColorMap = {
  ordered: "bg-blue-100 text-blue-800",
  in_production: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const statusDisplayNames = {
  ordered: "Commandé",
  in_production: "En production",
  completed: "Terminé",
  cancelled: "Annulé",
};

export function getStatusColor(status) {
  return statusColorMap[status] || "bg-gray-100 text-gray-800";
}

export function notifyOrderStatusChange(orderId, newStatus, customerName) {
  const title = customerName ? `Commande de ${customerName}` : `Commande #${orderId.slice(0, 6)}`;
  const message = `La commande est maintenant: ${statusDisplayNames[newStatus]}`;
  toast.success(message, { description: `${new Date().toLocaleString()}` });
}

export function notify(message, type = "info") {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast.info(message);
  }
}

export function notifyOrderCreated(orderId) {
  toast.success("Commande créée avec succès", {
    description: `Numéro de commande: ${orderId.slice(0, 6)}`
  });
}
