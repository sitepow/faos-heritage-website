import React from 'react';
import { MessageCircle } from 'lucide-react'; // ถ้ามีไลบรารี lucide-react อยู่แล้ว

export default function WhatsAppButton() {
  // แทนที่เบอร์โทรศัพท์ด้วยเบอร์ร้าน FAOS ของคุณ (ใส่รหัสประเทศ เช่น 66 ตามด้วยเบอร์โดยตัด 0 ตัวแรกออก)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const message = "Hello, Welcome to FAOS ASIA";
  const whatsappUrl = `https://wa.me/qr/64AMGOIJSFXTF1`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
    >
      {/* ใช้ไอคอน WhatsApp หรือไอคอนแชท */}
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}