export const SITE = {
  name: "Happy Tails",
  fullName: "Happy Tails Pet Store and Clinic",
  tagline: "Pet Store 24/7",
  phone: "03131495287",
  phoneIntl: "923131495287",
  whatsapp: "923131495287",
  address:
    "Plot 14-B, Ramna Plaza, Bela Rd, Main Markaz G 10 Markaz, G-10, Islamabad 44000, Pakistan",
  addressShort: "Ramna Plaza, 14-B Bela Rd, G-10 Markaz, Islamabad",
  hours: "Open 24 hours, every day",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13281.251204601453!2d73.0149681!3d33.6749638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfe28a1116a5%3A0xd76c243d5f54d918!2sHappy%20Tails%20Pet%20Store%2024%2F7!5e0!3m2!1sen!2s!4v1790499616243!5m2!1sen!2s",
  /* clean embed without Google's place card (coordinates only); we render our
     own address chip on top */
  mapEmbedPlain:
    "https://maps.google.com/maps?q=33.6749638,73.0149681&z=16&output=embed",
  mapsLink: "https://maps.google.com/?q=Happy+Tails+Pet+Store+24/7+G-10+Markaz+Islamabad",
};

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:+${SITE.phoneIntl}`;
}
