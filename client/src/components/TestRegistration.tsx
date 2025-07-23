import React from 'react';
import { Button } from '@/components/ui/button';

export default function TestRegistration() {
  const testRegistration = async () => {
    try {
      console.log('Starting test registration...');
      
      const testData = {
        email: 'test@example.com',
        password: 'test123456',
        firstName: 'Test',
        lastName: 'User',
        userType: 'man'
      };
      
      console.log('Test data:', testData);
      
      // Method 1: Simple fetch
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
        credentials: 'include',
      });
      
      console.log('Response:', response);
      console.log('Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
        alert('Registration test successful!');
      } else {
        const error = await response.json();
        console.error('Error:', error);
        alert('Registration test failed: ' + error.message);
      }
    } catch (error) {
      console.error('Catch error:', error);
      alert('Registration test error: ' + error.message);
    }
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
      <Button onClick={testRegistration} variant="outline">
        Test Registration
      </Button>
    </div>
  );
}