import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Bengali blood group names
export const bloodGroupNames: Record<string, string> = {
  'A+': 'এ পজিটিভ',
  'A-': 'এ নেগেটিভ',
  'B+': 'বি পজিটিভ',
  'B-': 'বি নেগেটিভ',
  'O+': 'ও পজিটিভ',
  'O-': 'ও নেগেটিভ',
  'AB+': 'এবি পজিটিভ',
  'AB-': 'এবি নেগেটিভ',
};

// Bengali district names
export const districts = [
  { name: 'Sunamganj', bn: 'সুনামগঞ্জ' },
  { name: 'Sylhet', bn: 'সিলেট' },
  { name: 'Moulvibazar', bn: 'মৌলভীবাজার' },
  { name: 'Habiganj', bn: 'হবিগঞ্জ' },
];

// Format date to Bengali
export function formatDateBengali(date: string | Date): string {
  const d = new Date(date);
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const day = toBengaliNumber(d.getDate());
  const month = months[d.getMonth()];
  const year = toBengaliNumber(d.getFullYear());
  return `${day} ${month}, ${year}`;
}

// Convert number to Bengali
export function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit)]);
}

// Generate WhatsApp share link
export function generateWhatsAppLink(request: {
  patient_name: string;
  blood_group: string;
  units_needed: number;
  hospital_name: string;
  hospital_address: string;
  required_date: string;
  contact_name: string;
  contact_phone: string;
}): string {
  const message = `🚨 রক্তের জরুরি আবেদন! 🚨

👤 রোগী: ${request.patient_name}
🩸 রক্তের গ্রুপ: ${request.blood_group}
📦 প্রয়োজন: ${request.units_needed} ব্যাগ

🏥 হাসপাতাল: ${request.hospital_name}
📍 ঠিকানা: ${request.hospital_address}
📅 তারিখ: ${request.required_date}

📞 যোগাযোগ: ${request.contact_name}
📱 ফোন: ${request.contact_phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Shantichakra Blood Society Sunamganj
"Together We Save Lives"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/?text=${encodedMessage}`;
}

// Generate Facebook share link
export function generateFacebookShareLink(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

// Calculate expiry time
export function calculateExpiry(hours: number): Date {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + hours);
  return expiryDate;
}

// Get urgency color
export function getUrgencyColor(level: string): string {
  switch (level) {
    case 'critical': return 'bg-red-500 text-white';
    case 'urgent': return 'bg-amber-500 text-white';
    case 'normal': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

// Get urgency label
export function getUrgencyLabel(level: string): string {
  switch (level) {
    case 'critical': return 'জরুরি';
    case 'urgent': return 'তাড়াতাড়ি';
    case 'normal': return 'সাধারণ';
    default: return level;
  }
}

// Validate Bangladesh phone number
export function isValidBangladeshPhone(phone: string): boolean {
  const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}
