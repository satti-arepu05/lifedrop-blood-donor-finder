import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        findDonor: 'Find a Donor',
        registerDonor: 'Become a Donor',
        emergencyRequest: 'Emergency Request',
        sampleData: 'Public Registry',
        about: 'About',
        contact: 'Contact',
        dashboard: 'Dashboard',
        login: 'Login',
        register: 'Sign Up',
        logout: 'Logout',
        admin: 'Admin'
      },
      hero: {
        tagline: 'Blood is to humans what water is to plants.',
        subtitle: 'The right donor at the right time can save a life. Connecting voluntary blood donors with hospitals and critical patients instantly during emergencies.',
        becomeDonorBtn: 'Become a Donor',
        findDonorBtn: 'Find a Donor Urgently',
        requestBloodBtn: 'Create Emergency Request'
      },
      stats: {
        donors: 'Registered Donors',
        cities: 'Cities Covered',
        requests: 'Lives Saved & Requests Fulfilled',
        bloodGroups: 'All 8 Blood Groups Active'
      },
      situations: {
        heading: 'Real-Life Situations Where Every Second Counts',
        subheading: 'In accidents, surgeries, or critical illness, blood is needed immediately.',
        highlight: 'The right donor at the right time can save a life.',
        accidents: 'Road Accidents',
        accidentsDesc: 'Severe trauma patients often require immediate transfusions of 4 to 10 units within the golden hour.',
        surgeries: 'Major Surgeries',
        surgeriesDesc: 'Complex bypass, organ transplants, and cancer surgeries rely on scheduled & reserve blood units.',
        critical: 'Critical Illness',
        criticalDesc: 'Patients fighting thalassemia, leukemia, and dengue need recurring platelet and blood replenishment.',
        emergency: 'Emergency Maternal Care',
        emergencyDesc: 'Postpartum hemorrhage remains a leading emergency where rapid blood access saves mother and child.'
      },
      howItWorks: {
        heading: 'How LifeDrop Works',
        step1Title: 'Donor Registration',
        step1Desc: 'Volunteers register with verified blood type, city, and 90-day eligibility check.',
        step2Title: 'Secure Database',
        step2Desc: 'Donors are indexed with privacy masking to protect personal identity until matched.',
        step3Title: 'Search & Match',
        step3Desc: 'Smart compatibility matrix ranks exact and universal matches in the patient’s city.',
        step4Title: 'Instant Notification',
        step4Desc: 'Targeted SMS, Email, and in-app alerts connect donors with the hospital immediately.'
      },
      compatibility: {
        heading: 'Interactive Blood Group Compatibility Guide',
        subheading: 'Understand who can donate to whom before requesting or donating blood.',
        recipient: 'Recipient (Patient)',
        canReceiveFrom: 'Can Receive Blood From',
        canDonateTo: 'Can Donate Blood To',
        universalDonor: 'Universal Red Blood Cell Donor',
        universalRecipient: 'Universal Red Blood Cell Recipient'
      },
      common: {
        emergencyHelpline: 'Emergency 24x7 Helpline: 1800-LIFEDROP',
        allRightsReserved: 'LifeDrop – Blood Donor Finder. Saving lives together.',
        loading: 'Loading data...',
        availableNow: 'Available Now',
        eligible: 'Eligible to Donate',
        ineligible: 'Next donation due soon'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        findDonor: 'रक्तदाता खोजें',
        registerDonor: 'रक्तदाता बनें',
        emergencyRequest: 'आपातकालीन अनुरोध',
        sampleData: 'सार्वजनिक सूची',
        about: 'हमारे बारे में',
        contact: 'संपर्क करें',
        dashboard: 'डैशबोर्ड',
        login: 'लॉग इन',
        register: 'पंजीकरण',
        logout: 'लॉग आउट',
        admin: 'एडमिन'
      },
      hero: {
        tagline: 'मनुष्यों के लिए रक्त वही है जो पौधों के लिए पानी है।',
        subtitle: 'सही समय पर सही रक्तदाता एक अनमोल जीवन बचा सकता है। आपात स्थिति में स्वैच्छिक रक्तदाताओं को सीधे अस्पतालों से जोड़ना।',
        becomeDonorBtn: 'रक्तदाता बनें',
        findDonorBtn: 'तुरंत रक्तदाता खोजें',
        requestBloodBtn: 'आपातकालीन अनुरोध दर्ज करें'
      },
      stats: {
        donors: 'पंजीकृत रक्तदाता',
        cities: 'सक्रिय शहर',
        requests: 'सफल रक्तदान और बचाई गई जानें',
        bloodGroups: 'सभी 8 रक्त समूह उपलब्ध'
      },
      situations: {
        heading: 'वास्तविक जीवन की स्थितियां जहाँ हर सेकंड कीमती है',
        subheading: 'दुर्घटनाओं, सर्जरी या गंभीर बीमारी में तुरंत रक्त की आवश्यकता होती है।',
        highlight: 'सही समय पर सही रक्तदाता एक जीवन बचा सकता है।',
        accidents: 'सड़क दुर्घटनाएं',
        accidentsDesc: 'गंभीर आघात के मरीजों को स्वर्णिम घंटे में तुरंत 4 से 10 यूनिट रक्त की आवश्यकता होती है।',
        surgeries: 'प्रमुख सर्जरी',
        surgeriesDesc: 'बाईपास, अंग प्रत्यारोपण और कैंसर सर्जरी सुरक्षित रक्त भंडार पर निर्भर करती हैं।',
        critical: 'गंभीर बीमारी',
        criticalDesc: 'थैलेसीमिया और डेंगू के मरीजों को बार-बार प्लेटलेट्स और रक्त की आवश्यकता होती है।',
        emergency: 'मातृ आपातकाल',
        emergencyDesc: 'प्रसव के दौरान समय पर रक्त मिलना माँ और बच्चे दोनों की जान बचाता है।'
      },
      howItWorks: {
        heading: 'लाइफड्रॉप कैसे काम करता है',
        step1Title: 'रक्तदाता पंजीकरण',
        step1Desc: 'स्वयंसेवक सत्यापित रक्त समूह और 90 दिनों की पात्रता के साथ पंजीकरण करते हैं।',
        step2Title: 'सुरक्षित डेटाबेस',
        step2Desc: 'निजता की सुरक्षा के लिए संपर्क विवरण सुरक्षित और एन्क्रिप्टेड रखे जाते हैं।',
        step3Title: 'खोज एवं सटीक मिलान',
        step3Desc: 'स्मार्ट कम्पैटिबिलिटी मैट्रिक्स उसी शहर में उपयुक्त रक्तदाताओं को प्राथमिकता देता है।',
        step4Title: 'त्वरित सूचना',
        step4Desc: 'एसएमएस, ईमेल और ऐप नोटिफिकेशन के माध्यम से तुरंत रक्तदाताओं को सतर्क किया जाता है।'
      },
      compatibility: {
        heading: 'रक्त समूह अनुकूलता चार्ट',
        subheading: 'जानिए कौन किसे रक्तदान कर सकता है।',
        recipient: 'मरीज का रक्त समूह',
        canReceiveFrom: 'इनसे रक्त प्राप्त कर सकता है',
        canDonateTo: 'इन्हें रक्त दान कर सकता है',
        universalDonor: 'सार्वभौमिक रक्तदाता',
        universalRecipient: 'सर्वग्राही रक्त समूह'
      },
      common: {
        emergencyHelpline: 'आपातकालीन हेल्पलाइन: 1800-LIFEDROP',
        allRightsReserved: 'लाइफड्रॉप - जीवन रक्षक रक्तदाता खोज मंच।',
        loading: 'लोड हो रहा है...',
        availableNow: 'अभी उपलब्ध',
        eligible: 'रक्तदान हेतु पात्र',
        ineligible: 'अगला रक्तदान जल्द देय'
      }
    }
  },
  te: {
    translation: {
      nav: {
        home: 'హోమ్',
        findDonor: 'రక్తదాతను వెతకండి',
        registerDonor: 'రక్తదాతగా చేరండి',
        emergencyRequest: 'అత్యవసర అభ్యర్థన',
        sampleData: 'దాతల జాబితా',
        about: 'మా గురించి',
        contact: 'సంప్రదించండి',
        dashboard: 'డాష్‌బోర్డ్',
        login: 'లాగిన్',
        register: 'రిజిస్టర్',
        logout: 'లాగౌట్',
        admin: 'అడ్మిన్'
      },
      hero: {
        tagline: 'మొక్కలకు నీరు ఎలాగో మనుషులకు రక్తం అలాగ.',
        subtitle: 'సరైన సమయంలో సరైన రక్తదాత ఒకరి ప్రాణాన్ని కాపాడగలరు. ఆపదలో ఉన్న రోగులను స్వచ్ఛంద రక్తదాతలతో వెంటనే అనుసంధానం చేస్తాము.',
        becomeDonorBtn: 'రక్తదాతగా చేరండి',
        findDonorBtn: 'దాతను వెతకండి',
        requestBloodBtn: 'అత్యవసర అభ్యర్థన చేయండి'
      },
      stats: {
        donors: 'నమోదైన రక్తదాతలు',
        cities: 'సేవలు ఉన్న నగరాలు',
        requests: 'కాపాడిన ప్రాణాలు',
        bloodGroups: '8 బ్లడ్ గ్రూపులు అందుబాటులో ఉన్నాయి'
      },
      situations: {
        heading: 'ప్రతి క్షణం విలువైన నిజజీవిత అత్యవసర పరిస్థితులు',
        subheading: 'ప్రమాదాలు, శస్త్రచికిత్సలు లేదా తీవ్రమైన అనారోగ్యంలో రక్తం వెంటనే అవసరం.',
        highlight: 'సరైన సమయంలో సరైన రక్తదాత ఒకరి ప్రాణాన్ని కాపాడగలరు.',
        accidents: 'రోడ్డు ప్రమాదాలు',
        accidentsDesc: 'తీవ్ర గాయాల పాలైన వారికి గోల్డెన్ అవర్‌లో తక్షణమే రక్తం ఎక్కించాల్సి ఉంటుంది.',
        surgeries: 'శస్త్రచికిత్సలు',
        surgeriesDesc: 'బైపాస్, ఆర్గాన్ ట్రాన్స్‌ప్లాంట్ వంటి పెద్ద సర్జరీలకు నిల్వ రక్తం అత్యవసరం.',
        critical: 'తీవ్ర అనారోగ్యం',
        criticalDesc: 'తలసేమియా, డెంగ్యూ బాధితులకు క్రమంతప్పకుండా రక్తం మరియు ప్లేట్‌లెట్లు అవసరం.',
        emergency: 'ప్రసూతి అత్యవసరాలు',
        emergencyDesc: 'ప్రసవ సమయంలో అధిక రక్తస్రావం జరిగినప్పుడు సకాలంలో రక్తం అందడం తల్లి ప్రాణాలను నిలబెడుతుంది.'
      },
      howItWorks: {
        heading: 'లైఫ్‌డ్రాప్ ఎలా పనిచేస్తుంది',
        step1Title: 'దాతల నమోదు',
        step1Desc: '90 రోజుల వ్యవధి పరిశీలనతో దాతలు సులభంగా తమ వివరాలు నమోదు చేసుకుంటారు.',
        step2Title: 'భద్రమైన డేటాబేస్',
        step2Desc: 'వ్యక్తిగత గోప్యతను కాపాడుతూ దాతల సమాచారం భద్రంగా నిక్షిప్తం చేయబడుతుంది.',
        step3Title: 'శోధన & మ్యాచ్',
        step3Desc: 'అదే నగరంలో సరిపోయే బ్లడ్ గ్రూపు ఉన్న దాతలను సిస్టమ్ వెంటనే గుర్తిస్తుంది.',
        step4Title: 'తక్షణ నోటిఫికేషన్',
        step4Desc: 'SMS, ఇమెయిల్ మరియు యాప్ ద్వారా దాతలకు సందేశం వెళ్లి ప్రాణాలు కాపాడబడతాయి.'
      },
      compatibility: {
        heading: 'బ్లడ్ గ్రూప్ మ్యాచ్ గైడ్',
        subheading: 'ఎవరు ఎవరికి రక్తం ఇవ్వవచ్చో తెలుసుకోండి.',
        recipient: 'రోగి బ్లడ్ గ్రూప్',
        canReceiveFrom: 'వీరి నుండి స్వీకరించవచ్చు',
        canDonateTo: 'వీరికి దానం చేయవచ్చు',
        universalDonor: 'సార్వత్రిక రక్తదాత',
        universalRecipient: 'సార్వత్రిక గ్రహీత'
      },
      common: {
        emergencyHelpline: '24x7 అత్యవసర హెల్ప్‌లైన్: 1800-LIFEDROP',
        allRightsReserved: 'లైఫ్‌డ్రాప్ – బ్లడ్ డోనర్ ఫైండర్.',
        loading: 'లోడ్ అవుతోంది...',
        availableNow: 'ఇప్పుడు అందుబాటులో ఉంది',
        eligible: 'రక్తదానానికి అర్హులు',
        ineligible: 'తదుపరి దానం త్వరలో'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lifedrop_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
