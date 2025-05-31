interface TwilioToken {
  token: string;
  identity: string;
}

interface SMSRequest {
  to: string;
  message: string;
}

interface SMSResponse {
  success: boolean;
  messageSid?: string;
  error?: string;
}

// Get Twilio access token from your API
export async function getTwilioToken(): Promise<TwilioToken> {
  try {
    const response = await fetch('https://api.orderlybite.com/token');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get Twilio token: ${error.message}`);
    }
    throw new Error('Failed to get Twilio token: Unknown error');
  }
}

// Send SMS via your API
export async function sendSMS(to: string, message: string): Promise<SMSResponse> {
  try {
    const response = await fetch('https://api.orderlybite.com/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
    throw new Error('Failed to send SMS: Unknown error');
  }
}

// Make a call using Twilio Voice SDK
export async function makeCall(to: string): Promise<void> {
  try {
    // Import Twilio Voice SDK dynamically
    const { Device } = await import('@twilio/voice-sdk');
    
    // Get access token
    const tokenData = await getTwilioToken();
    
    // Initialize Twilio Device
    const device = new Device(tokenData.token);
    
    // Set up device event listeners
    device.on('ready', () => {
      console.log('Twilio Device is ready');
    });
    
    device.on('error', (error) => {
      console.error('Twilio Device error:', error);
    });
    
    device.on('incoming', (call) => {
      console.log('Incoming call:', call);
    });
    
    // Register the device
    await device.register();
    
    // Make the call to the Twilio number
    const call = await device.connect({
      params: {
        To: '18044092778', // Your Twilio number
        From: to // The number to call from
      }
    });
    
    console.log('Call initiated:', call);
    
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
}

// Initialize Twilio Device for incoming calls
export async function initializeTwilioDevice(): Promise<any> {
  try {
    const { Device } = await import('@twilio/voice-sdk');
    const tokenData = await getTwilioToken();
    
    const device = new Device(tokenData.token);
    
    device.on('ready', () => {
      console.log('Twilio Device ready for incoming calls');
    });
    
    device.on('incoming', (call) => {
      console.log('Incoming call from:', call.parameters.From);
      // Auto-accept incoming calls or show UI to accept/reject
      call.accept();
    });
    
    device.on('error', (error) => {
      console.error('Twilio Device error:', error);
    });
    
    await device.register();
    return device;
    
  } catch (error) {
    console.error('Error initializing Twilio device:', error);
    throw error;
  }
}