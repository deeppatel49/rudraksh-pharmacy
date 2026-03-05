'use client';

import { useState, useEffect } from 'react';
import StoreLocatorView from '../components/store-locator-view';

export default function StoreLocatorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <StoreLocatorView />
    </main>
  );
}
