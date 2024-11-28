import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Upload, Clock, MessageSquare, Phone } from 'lucide-react';
import AuthModal from '../auth/AuthModal';

interface OnlineCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnlineCheckinModal({ isOpen, onClose }: OnlineCheckinModalProps) {
  const [step, setStep] = useState(1);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchBooking, setSearchBooking] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [arrivalTime, setArrivalTime] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [question, setQuestion] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate finding booking
    setStep(2);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle final submission
    console.log({
      uploadedFile,
      arrivalTime,
      whatsappNumber,
      question
    });
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {step > 1 && (
                      <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <h2 className="text-2xl font-serif font-bold">Online Check-in</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Find Booking */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Find Your Booking</h3>
                      <button
                        onClick={() => setIsAuthOpen(true)}
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                      >
                        Sign in instead
                      </button>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Booking Reference
                        </label>
                        <input
                          type="text"
                          value={searchBooking}
                          onChange={(e) => setSearchBooking(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                          placeholder="Enter your booking reference"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Search className="w-5 h-5" />
                        Find Booking
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 2: ID Upload */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Upload Identification</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Please upload a clear photo of your passport or ID card
                      </p>

                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          id="id-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                        <label
                          htmlFor="id-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {uploadedFile ? uploadedFile.name : 'Click to upload'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={!uploadedFile}
                      className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 3: Arrival Time */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Expected Arrival Time</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <input
                          type="time"
                          value={arrivalTime}
                          onChange={(e) => setArrivalTime(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 4: WhatsApp Concierge */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">WhatsApp Concierge</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Get instant support through our WhatsApp concierge service
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            WhatsApp Number
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <input
                              type="tel"
                              value={whatsappNumber}
                              onChange={(e) => setWhatsappNumber(e.target.value)}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                              placeholder="+254 700 000 000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ask Your First Question
                          </label>
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-5 h-5 text-gray-500 mt-2" />
                            <textarea
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                              placeholder="What would you like to know?"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full bg-amber-600 text-white py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
                    >
                      Complete Check-in
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}