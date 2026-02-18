// frontend/src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">TaskMaster</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              The simplest way to manage your tasks and boost productivity.
              Sign up today to get started with your personal todo list.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 border border-indigo-200"
            >
              Create Account
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Maximum Productivity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to organize your tasks and achieve your goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✓',
                title: 'Simple Task Management',
                description: 'Easily create, update, and track your tasks in one place.'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'Your data is protected with industry-standard security.'
              },
              {
                icon: '📱',
                title: 'Always Accessible',
                description: 'Access your tasks from any device, anywhere.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300"
              >
                <div className="text-indigo-600 text-4xl mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-10 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Join thousands of users who have transformed their workflow with TaskMaster
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            Get Started Today
          </Link>
        </motion.div>
      </div>
    </div>
  );
}