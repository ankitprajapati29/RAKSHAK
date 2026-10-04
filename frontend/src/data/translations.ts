export const RESULT_TRANSLATIONS = {
  highRiskExplanation:
    'इस संदेश में एक या अधिक गंभीर चेतावनी संकेत हैं। कार्रवाई करने से पहले हाइलाइट किए गए सबूतों की ध्यान से समीक्षा करें।',

  suspiciousExplanation:
    'इस संदेश में कई चेतावनी संकेत हैं जिनकी अतिरिक्त पुष्टि करना उचित है।',

  lowConcernWithFlagsExplanation:
    'इस संदेश में कुछ चेतावनी संकेत हैं, लेकिन वर्तमान नियम इसे संदिग्ध के रूप में वर्गीकृत नहीं करते।',

  lowConcernExplanation:
    'इस संदेश में कोई कॉन्फ़िगर किया गया चेतावनी पैटर्न नहीं मिला। इसका मतलब यह नहीं है कि संदेश सुरक्षित, वैध या सत्यापित है।',

  safeSteps: [
    'इस संदेश के आधार पर पैसे या संवेदनशील जानकारी साझा न करें।',
    'प्रेषक और दावे की स्वतंत्र आधिकारिक स्रोत से पुष्टि करें।',
    'संदिग्ध लिंक पर क्लिक न करें और अनपेक्षित फ़ाइल डाउनलोड न करें।',
  ],

  urlWarningExplanation:
    'इस URL में संरचनात्मक चेतावनी संकेत हैं। क्लिक करने या जानकारी दर्ज करने से पहले गंतव्य की पुष्टि करें।',

  urlWarnings: {
    'The URL contains an @ symbol or embedded credentials.':
      'इस URL में @ चिन्ह या एम्बेडेड क्रेडेंशियल शामिल हैं।',

    'The URL uses an IP address instead of a domain name.':
      'यह URL डोमेन नाम के बजाय IP एड्रेस का उपयोग करता है।',

    'The URL is unusually long.':
      'यह URL असामान्य रूप से लंबा है।',

    'The URL contains an unusually deep subdomain structure.':
      'इस URL में असामान्य रूप से गहरी सबडोमेन संरचना है।',

    'The domain uses punycode encoding.':
      'इस डोमेन में Punycode एन्कोडिंग का उपयोग किया गया है।',

    'The URL does not use HTTPS.':
      'यह URL HTTPS का उपयोग नहीं करता है।',
  },
} as const
