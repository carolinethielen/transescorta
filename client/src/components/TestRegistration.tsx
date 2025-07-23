import React from 'react';
import { Button } from '@/components/ui/button';

export default function TestRegistration() {
  const testRegistration = () => {
    const testData = {
      email: 'test@example.com',
      password: 'test123456',
      firstName: 'Test',
      lastName: 'User',
      userType: 'man'
    };
    
    // Use XMLHttpRequest instead of fetch
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/auth/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          console.log('XHR Success:', result);
          alert('Registration test successful with XHR!');
        } catch (e) {
          alert('XHR response parsing error: ' + e.message);
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          alert('XHR Registration failed: ' + errorData.message);
        } catch (e) {
          alert(`XHR HTTP ${xhr.status}: ${xhr.statusText}`);
        }
      }
    };
    
    xhr.onerror = function() {
      alert('XHR Network error');
    };
    
    console.log('Sending XHR request with data:', testData);
    xhr.send(JSON.stringify(testData));
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
      <Button onClick={testRegistration} variant="outline">
        Test Registration
      </Button>
    </div>
  );
}