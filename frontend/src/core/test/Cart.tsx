import React from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import type { CartItem } from "../types";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getItemPrice = (item: CartItem) => {
    return item.selectedSize === "individual" && item["monto individual"]
      ? item["monto individual"]
      : item.monto;
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + getItemPrice(item) * item.quantity,
      0,
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Carrito</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag size={64} className="mb-4" />
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-sm">Agrega algunos platos deliciosos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800 flex-1">
                      {item["nombre largo"]}
                      <span className="text-xs text-gray-500 ml-2">
                        (
                        {item.selectedSize === "individual"
                          ? "Individual"
                          : "Completo"}
                        )
                      </span>
                    </h3>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(index, item.quantity - 1)
                        }
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(index, item.quantity + 1)
                        }
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="font-bold text-gray-800">
                      {formatPrice(getItemPrice(item) * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 rounded-lg transition-all">
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
