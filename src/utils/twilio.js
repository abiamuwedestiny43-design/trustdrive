export const sendSMS = async (to = '+18777804236', body = 'Ahoy 👋') => {
  const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const messagingServiceSid = import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID;
  
  // Development fallback
  if (!accountSid || !authToken || accountSid.includes('your_') || accountSid.includes('ACxxxx')) {
    console.log('--- TWILIO DEV MODE ---');
    console.log(`To: ${to}`);
    console.log(`Body: ${body}`);
    console.log('-----------------------');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { sid: 'mock_sid_for_dev', status: 'sent' };
  }

  const encodedCredentials = btoa(`${accountSid}:${authToken}`);

  const details = {
    To: to,
    MessagingServiceSid: messagingServiceSid,
    Body: body
  };

  const formBody = Object.keys(details)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
    .join('&');

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Twilio API Error:', data);
        throw new Error(data.message || `Twilio error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    throw error;
  }
};
