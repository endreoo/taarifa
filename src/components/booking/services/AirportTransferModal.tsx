import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface AirportTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: any) => void;
}

export default function AirportTransferModal({ isOpen, onClose, onConfirm }: AirportTransferModalProps) {
  const [flightNumber, setFlightNumber] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('pickup');
  const [requests, setRequests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ flightNumber, time, type, requests });
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
                <h3 className="text-xl font-medium">Airport Transfer Details</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType('pickup')}
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2
                      ${type === 'pickup' ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}
                    `}
                  >
                    <Plane className="w-4 h-4" />
                    Airport Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('dropoff')}
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2
                      ${type === 'dropoff' ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}
                    `}
                  >
                    <Plane className="w-4 h-4 rotate-90" />
                    Airport Dropoff
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flight Number (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder="e.g., KQ100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'pickup' ? 'Pickup Time' : 'Departure Time'}
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-500 mt-2" />
                  <textarea
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder="Any special requirements..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
              >
                Confirm Transfer
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}