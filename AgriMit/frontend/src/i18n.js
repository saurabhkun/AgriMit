import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navbar
      'Agrimit': 'Agrimit',
      'AI Field Health Assistant': 'AI Field Health Assistant',
      'Farmer': 'Farmer',
      'Expert': 'Expert',
      'Sign In': 'Sign In',
      'Sign Up': 'Sign Up',
      'Logout': 'Logout',
      
      // Welcome
      'Welcome to AgriMit': 'Welcome to AgriMit',
      'Click Sign Up or Sign In to get started with AI-powered field monitoring.': 'Click Sign Up or Sign In to get started with AI-powered field monitoring.',
      
      // FarmerView
      'Farm Map & Selection': 'Farm Map & Selection',
      'Field List': 'Field List',
      'Select a Field': 'Select a Field',
      'Active Field': 'Active Field',
      'Upload Crop Image': 'Upload Crop Image',
      'Soil & Weather Analysis': 'Soil & Weather Analysis',
      'AI-Powered Advice': 'AI-Powered Advice',
      'Generate Advice': 'Generate Advice',
      'Generating advice…': 'Generating advice…',
      
      // ExpertView
      'Farms Map': 'Farms Map',
      'Fields': 'Fields',
      'Field Detail': 'Field Detail',
      'Recent Image Analyses': 'Recent Image Analyses',
      'Sensor Risk Overview': 'Sensor Risk Overview',
      'Last AI Advice': 'Last AI Advice',
      
      // Common
      'Loading…': 'Loading…',
      'Loading fields…': 'Loading fields…',
      'Healthy': 'Healthy',
      'Caution': 'Caution',
      'Critical': 'Critical',
      'Area': 'Area',
      'acres': 'acres'
    }
  },
  hi: {
    translation: {
      // Hindi translations
      'Agrimit': 'अग्रिमित',
      'AI Field Health Assistant': 'एआई फील्ड स्वास्थ्य सहायक',
      'Farmer': 'किसान',
      'Expert': 'विशेषज्ञ',
      'Sign In': 'साइन इन',
      'Sign Up': 'साइन अप',
      'Logout': 'लॉगआउट',
      
      'Welcome to AgriMit': 'अग्रिमित में आपका स्वागत है',
      'Click Sign Up or Sign In to get started with AI-powered field monitoring.': 'एआई-संचालित फील्ड निगरानी शुरू करने के लिए साइन अप या साइन इन पर क्लिक करें।',
      
      'Farm Map & Selection': 'फार्म मैप और चयन',
      'Field List': 'खेत सूची',
      'Select a Field': 'खेत चुनें',
      'Active Field': 'सक्रिय खेत',
      'Upload Crop Image': 'फसल छवि अपलोड करें',
      'Soil & Weather Analysis': 'मिट्टी और मौसम विश्लेषण',
      'AI-Powered Advice': 'एआई-संचालित सलाह',
      'Generate Advice': 'सलाह उत्पन्न करें',
      'Generating advice…': 'सलाह उत्पन्न हो रही है…',
      
      'Farms Map': 'खेतों का मानचित्र',
      'Fields': 'खेत',
      'Field Detail': 'खेत विवरण',
      'Recent Image Analyses': 'हाल की छवि विश्लेषण',
      'Sensor Risk Overview': 'सेंसर जोखिम अवलोकन',
      'Last AI Advice': 'अंतिम एआई सलाह',
      
      'Loading…': 'लोड हो रहा है…',
      'Loading fields…': 'खेत लोड हो रहे हैं…',
      'Healthy': 'स्वस्थ',
      'Caution': 'सावधान',
      'Critical': 'गंभीर',
      'Area': 'क्षेत्र',
      'acres': 'एकड़'
    }
  },
  mr: {
    translation: {
      // Marathi
      'Agrimit': 'अग्रिमित',
      'AI Field Health Assistant': 'AI शेत आरोग्य सहाय्यक',
      'Farmer': 'शेतकरी',
      'Expert': 'तज्ज्ञ',
      'Sign In': 'साइन इन',
      'Sign Up': 'साइन अप',
      'Logout': 'बाहेर पडा',
      
      'Welcome to AgriMit': 'अग्रिमित मध्ये स्वागत आहे',
      'Click Sign Up or Sign In to get started with AI-powered field monitoring.': 'AI-आधारित शेत निरीक्षण सुरू करण्यासाठी साइन अप किंवा साइन इन करा.',
      
      'Farm Map & Selection': 'शेत नकाशा आणि निवड',
      'Field List': 'शेत यादी',
      'Select a Field': 'शेत निवडा',
      'Active Field': 'सक्रिय शेत',
      'Upload Crop Image': 'पिकाची प्रत अपलोड करा',
      'Soil & Weather Analysis': 'माती आणि हवामान विश्लेषण',
      'AI-Powered Advice': 'AI-आधारित सल्ला',
      'Generate Advice': 'सलाह तयार करा',
      'Generating advice…': 'सलाह तयार होत आहे…',
      
      'Farms Map': 'शेतांचा नकाशा',
      'Fields': 'शेते',
      'Field Detail': 'शेत तपशील',
      'Recent Image Analyses': 'अलीकडील प्रत विश्लेषण',
      'Sensor Risk Overview': 'सेन्सर धोका आढावा',
      'Last AI Advice': 'शेवटचा AI सल्ला',
      
      'Loading…': 'लोड होत आहे…',
      'Loading fields…': 'शेते लोड होत आहेत…',
      'Healthy': 'निरोगी',
      'Caution': 'सावधान',
      'Critical': 'गंभीर',
      'Area': 'क्षेत्रफळ',
      'acres': 'अॅक्र'
    }
  },
  kn: {
    translation: {
      // Kannada
      'Agrimit': 'ಅಗ್ರಿಮಿಟ್',
      'AI Field Health Assistant': 'AI ಫೀಲ್ಡ್ ಆರೋಗ್ಯ ಸಹಾಯಕ',
      'Farmer': 'ಕಣ್ಣುಹುಡುಗ',
      'Expert': 'ನಿಪುಣ',
      'Sign In': 'ಸೈನ್ ಇನ್',
      'Sign Up': 'ಸೈನ್ ಅಪ್',
      'Logout': 'ಲಾಗ್‌ಔಟ್',
      
      'Welcome to AgriMit': 'ಅಗ್ರಿಮಿಟ್‌ಗೆ ಸ್ವಾಗತ',
      'Click Sign Up or Sign In to get started with AI-powered field monitoring.': 'AI ಆಧಾರಿತ ಫೀಲ್ಡ್ ಮೇಲ್ವಿಚಾರಣೆ ಆರಂಭಿಸಲು ಸೈನ್ ಅಪ್ ಅಥವಾ ಸೈನ್ ಇನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.',
      
      'Farm Map & Selection': 'ಗ್ರಾಮೀಣ ನಕ್ಷೆ ಮತ್ತು ಆಯ್ಕೆ',
      'Field List': 'ಭೂಮಿ ಪಟ್ಟಿ',
      'Select a Field': 'ಭೂಮಿ ಆಯ್ಕೆಮಾಡಿ',
      'Active Field': 'ಸಕ್ರಿಯ ಭೂಮಿ',
      'Upload Crop Image': 'ಪಂಧರ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      'Soil & Weather Analysis': 'ಮಣ್ಣು & ಹವಾಮಾನ ವಿಶ್ಲೇಷಣೆ',
      'AI-Powered Advice': 'AI ಆಧಾರಿತ ಸಲಹೆ',
      'Generate Advice': 'ಸಲಹೆ ರಚಿಸಿ',
      'Generating advice…': 'ಸಲಹೆ ರಚಿಸಲಾಗುತ್ತಿದೆ…',
      
      'Farms Map': 'ಗ್ರಾಮೀಣ ನಕ್ಷೆ',
      'Fields': 'ಭೂಮಿಗಳು',
      'Field Detail': 'ಭೂಮಿ ವಿವರ',
      'Recent Image Analyses': 'ಇತ್ತೀಚಿನ ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆಗಳು',
      'Sensor Risk Overview': 'ಸೆನ್ಸರ್ ರಿಸ್ಕ್ ಅವಲೋಕನ',
      'Last AI Advice': 'ಕಡೆಯ AI ಸಲಹೆ',
      
      'Loading…': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
      'Loading fields…': 'ಭೂಮಿಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ…',
      'Healthy': 'ಆರೋಗ್ಯವಂತ',
      'Caution': 'ಎಚ್ಚರಿಕೆ',
      'Critical': 'ಗಂಭೀರ',
      'Area': 'ಪ್ರದೇಶ',
      'acres': 'ಎಕರೆಗಳು'
    }
  },
  te: {
    translation: {
      // Telugu
      'Agrimit': 'అగ్రిమిట్',
      'AI Field Health Assistant': 'AI ఫీల్డ్ ఆరోగ్య సహాయకుడు',
      'Farmer': 'కర్మాగారం',
      'Expert': 'విశేషజ్ఞుడు',
      'Sign In': 'సైన్ ఇన్',
      'Sign Up': 'సైన్ అప్',
      'Logout': 'లాగ్అవుట్',
      
      'Welcome to AgriMit': 'అగ్రిమిట్‌కు స్వాగతం',
      'Click Sign Up or Sign In to get started with AI-powered field monitoring.': 'AI-ఆధారిత ఫీల్డ్ మానిటరింగ్‌తో ప్రారంభించడానికి సైన్ అప్ లేదా సైన్ ఇన్ క్లిక్ చేయండి.',
      
      'Farm Map & Selection': 'ఫామ్ మ్యాప్ & ఎంపిక',
      'Field List': 'ఫీల్డ్ జాబితా',
      'Select a Field': 'ఫీల్డ్ ఎంచుకోండి',
      'Active Field': 'సక్రియ ఫీల్డ్',
      'Upload Crop Image': 'పంట చిత్రం అప్‌లోడ్ చేయండి',
      'Soil & Weather Analysis': 'మట్టి & వాతావరణ విశ్లేషణ',
      'AI-Powered Advice': 'AI-ఆధారిత సలహా',
      'Generate Advice': 'సలహా రూపొందించండి',
      'Generating advice…': 'సలహా రూపొందిస్తోంది…',
      
      'Farms Map': 'ఫామ్‌ల మ్యాప్',
      'Fields': 'ఫీల్డ్‌లు',
      'Field Detail': 'ఫీల్డ్ వివరాలు',
      'Recent Image Analyses': 'ఇటీవలి చిత్ర విశ్లేషణలు',
      'Sensor Risk Overview': 'సెన్సార్ రిస్క్ అవలోకనం',
      'Last AI Advice': 'చివరి AI సలహా',
      
      'Loading…': 'లోడ్ అవుతోంది…',
      'Loading fields…': 'ఫీల్డ్‌లు లోడ్ అవుతున్నాయి…',
      'Healthy': 'ఆరోగ్యకరమైనది',
      'Caution': 'జాగ్రత్త',
      'Critical': 'విమర్శనాత్మక',
      'Area': 'ప్రాంతం',
      'acres': 'ఎకరాలు'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

