// reCAPTCHA v3 utility functions
declare global {
  interface Window {
    grecaptcha: any;
  }
}

const RECAPTCHA_SITE_KEY = '6LeWxo4rAAAAAG0HO9obSW5sBHR-Hw4WoUzNylSm';

export const executeRecaptcha = async (action: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
        .then((token: string) => {
          resolve(token);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  });
};

export const verifyRecaptcha = async (token: string, action: string) => {
  try {
    const response = await fetch('/api/auth/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, action }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('reCAPTCHA verification failed');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};