import { motion } from 'framer-motion';
import { Shield, Coffee, MapPin } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Located in the prestigious Parklands area, minutes from key attractions"
    },
    {
      icon: Coffee,
      title: "Premium Amenities",
      description: "Fully furnished suites with modern appliances and high-speed internet"
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security and secure parking for peace of mind"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold mb-4">Why Choose Taarifa Suites?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of luxury living and convenience in Nairobi's most prestigious neighborhood
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <feature.icon className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}