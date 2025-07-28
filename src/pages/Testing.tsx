import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TestingSuite } from '@/components/TestingSuite';

export default function Testing() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">System Testing</h1>
          <p className="text-xl text-muted-foreground">
            Test all system components and integrations
          </p>
        </div>
        <TestingSuite />
      </div>
      <Footer />
    </div>
  );
}