import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBasket, MessageSquare, Check } from 'lucide-react';
import { useState } from 'react';

interface FridgeServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: any) => void;
}

export default function FridgeServiceModal({ isOpen, onClose, onConfirm }: FridgeServiceModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [requests, setRequests] = useState('');

  const commonItems = [
    { id: 'water', name: 'Mineral Water', price: 5 },
    { id: 'milk', name: 'Fresh Milk', price: 3 },
    { id: 'bread', name: 'Bread', price: 2 },
    { id: 'eggs', name: 'Eggs', price: 4 },
    { id: 'fruits', name: 'Fresh Fruits', price: 10 },
    { id: 'yogurt', name: 'Yogurt', price: 5 },
    { id: 'juice', name: 'Fresh Juice', price: 6 },
    { id: 'cheese', name: 'Cheese Selection', price: 8 }
  ];

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ items: selectedItems, requests });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Fill Up Your Fridge</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Common Items
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {commonItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`p-3 rounded-lg border text-left flex items-center gap-2
                        ${selectedItems.includes(item.id)
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200'
                        }
                      `}
                    >
                      <div className="flex-grow">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">${item.price}</div>
                      </div>
                      {selectedItems.includes(item.id) && (
                        <Check className="w-5 h-5 text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requests
                </label>
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-500 mt-2" />
                  <textarea
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder="List any specific items or preferences..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
              >
                Confirm Selection
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}