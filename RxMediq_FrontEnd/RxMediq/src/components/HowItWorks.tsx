import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, Shield, Pill } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface Step {
  icon: JSX.Element;
  title: string;
  description: string;
}

export const HowItWorks: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // Simulate fetching steps from a backend or configuration file
    const fetchSteps = async () => {
      const fetchedSteps = [
        {
          icon: <FileText className="w-12 h-12" />,
          title: "Enter Medical History",
          description: "Securely input your medical history and current symptoms",
        },
        {
          icon: <Brain className="w-12 h-12" />,
          title: "AI Analysis",
          description: "Our advanced AI analyzes your health data for patterns",
        },
        {
          icon: <Shield className="w-12 h-12" />,
          title: "Blockchain Security",
          description: "Your data is encrypted and stored on the blockchain",
        },
        {
          icon: <Pill className="w-12 h-12" />,
          title: "Get Recommendations",
          description: "Receive personalized drug and treatment recommendations",
        },
      ];
      setSteps(fetchedSteps);
    };

    fetchSteps();
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Four simple steps to revolutionize your healthcare journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-700 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-500 mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-blue-500"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};