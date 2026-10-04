export interface EntityReference {
  id: string
  name: string
  aliases: string[]
  category: 'regulator' | 'exchange' | 'platform' | 'financial-institution'
  description: {
    en: string
    hi: string
  }
}

export const ENTITY_REFERENCES: EntityReference[] = [
  {
    id: 'sebi',
    name: 'SEBI',
    aliases: ['sebi', 'securities and exchange board of india'],
    category: 'regulator',
    description: {
      en: 'Indian securities-market regulator.',
      hi: 'भारत के प्रतिभूति बाजार का नियामक।',
    },
  },
  {
    id: 'rbi',
    name: 'RBI',
    aliases: ['rbi', 'reserve bank of india'],
    category: 'regulator',
    description: {
      en: 'India’s central bank.',
      hi: 'भारत का केंद्रीय बैंक।',
    },
  },
  {
    id: 'nse',
    name: 'NSE',
    aliases: ['nse', 'national stock exchange'],
    category: 'exchange',
    description: {
      en: 'Indian stock exchange.',
      hi: 'भारत का स्टॉक एक्सचेंज।',
    },
  },
  {
    id: 'bse',
    name: 'BSE',
    aliases: ['bse', 'bombay stock exchange'],
    category: 'exchange',
    description: {
      en: 'Indian stock exchange.',
      hi: 'भारत का स्टॉक एक्सचेंज।',
    },
  },
  {
    id: 'zerodha',
    name: 'Zerodha',
    aliases: ['zerodha'],
    category: 'platform',
    description: {
      en: 'Indian financial services and brokerage platform.',
      hi: 'भारत का वित्तीय सेवा और ब्रोकरेज प्लेटफॉर्म।',
    },
  },
  {
    id: 'groww',
    name: 'Groww',
    aliases: ['groww'],
    category: 'platform',
    description: {
      en: 'Indian investment and financial services platform.',
      hi: 'भारत का निवेश और वित्तीय सेवा प्लेटफॉर्म।',
    },
  },
]
