export const sendSMS = async (to = '+18777804236', body = 'Ahoy 👋') => {
  const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const messagingServiceSid = import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID;
  
  // Note: btoa is safe for browser environments.
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

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    throw error;
  }
};
