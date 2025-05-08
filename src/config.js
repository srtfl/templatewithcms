const config = {
  // Brand configuration for site identity
  brand: {
    name: "Coco Bubble Tea",
    logo: "/images/logo2.png",
    themeColor: "#FBBF24", // Background (header/nav)
    accentColor: "#FF6B00", // Buttons, highlights
    textColor: "#666666", // Default text color
  },

  // Contact details for the business
  contact: {
    phone: "123-456-7890",
    email: "info@coco.com",
    addressLine1: "123 Tea Lane",
    city: "Brewtown",
    postcode: "BT1 2EA",
  },

  // Social media links
  social: {
    instagram: "https://instagram.com/cocobubbletea",
    facebook: "https://facebook.com/cocobubbletea",
    twitter: "https://twitter.com/cocobubbletea",
  },

  // Navigation menu items
  navigation: [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
  ],

  // Footer configuration
  footer: {
    sections: [
      {
        title: "Quick Links",
        type: "navigation",
        items: "navigation" // References navigation array
      },
      {
        title: "Contact Us",
        type: "contact",
        display: [
          { field: "brand.name" },
          { field: "contact.address.line1" },
          { field: "contact.address.city" },
          { field: "contact.address.postcode" },
          { field: "contact.address.email", prefix: "Email: " },
          { field: "contact.address.phone", prefix: "Phone: " }
        ]
      },
      {
        title: "Follow Us",
        type: "social",
        platforms: ["facebook", "instagram", "twitter"]
      }
    ],
    copyright: {
      text: "© {year} {brand.name}. All rights reserved.",
      year: new Date().getFullYear()
    }
  },

  // Firestore schema for flexible data structure
  firestoreSchema: {
    products: {
      requiredFields: ["name", "price", "category"],
      optionalFields: ["size", "description", "image", "calories", "featured", "toppings"],
    },
    categories: {
      requiredFields: ["value", "displayName"],
      optionalFields: ["description", "image"],
    },
    promotions: {
      requiredFields: ["active", "category", "price"],
      optionalFields: ["size", "requiredQuantity", "type"],
    },
  },

  // Promotion types for flexible discount calculations
  promotionTypes: {
    fixedPrice: {
      calculate: (items, promo) => {
        const requiredQuantity = promo.requiredQuantity || 1;
        const sets = Math.floor(
          items.reduce((sum, item) => sum + item.quantity, 0) / requiredQuantity
        );
        return sets * promo.price;
      },
    },
    buyOneGetOne: {
      calculate: (items, promo) => {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        return Math.floor(totalQuantity / 2) * items[0].price;
      },
    },
  },

  // Dynamic content for components
  about: {
    hero: {
      title: "About Us",
      subtitle: "Discover the story behind Coco's Bubble Tea and our passion for bringing joy through delicious drinks.",
      image: "https://images.unsplash.com/photo-1627308595333-1c27f4b7250d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      fallbackImage: "/images/bubble-tea-shop.jpg",
    },
    story: {
      title: "Our Story",
      content:
        "Founded in 2025, Coco's Bubble Tea started as a small family business with a big dream: to share the joy of authentic bubble tea with the world. Inspired by the vibrant flavors of traditional Taiwanese bubble tea, we set out to create a space where friends and families can gather, laugh, and make memories over a refreshing drink.",
      caption: "💬 Crafting Happiness, One Sip at a Time",
    },
    mission: {
      title: "Our Mission",
      content:
        "At Coco's Bubble Tea, our mission is to spark joy in every sip. We strive to create a welcoming environment where everyone feels at home, offering innovative drinks that celebrate diversity and creativity.",
      features: [
        { icon: "🍃", label: "Fresh Ingredients" },
        { icon: "🥤", label: "Handcrafted With Love" },
        { icon: "💛", label: "Loved by the Community" },
      ],
    },
  },

  home: {
    hero: {
      title: "Spark Up Every Moment!",
      subtitle: "Sip the Fun – Dive into Deliciousness!",
      image: "/images/hero-bubble-tea.jpg",
      fallbackImage: "/images/default-hero.jpg",
    },
    featured: {
      title: "Featured Drinks",
      subtitle: "Try some of our most popular bubble tea creations, loved by our customers worldwide.",
    },
    promo: {
      title: "Try Our New Seasonal Drink",
      subtitle: "Introducing our limited-edition Mango Passionfruit Tea – a burst of tropical flavors in every sip!",
      image: "https://via.placeholder.com/1920x400?text=Promotional+Banner",
      fallbackImage: "/images/default-promo.jpg",
    },
  },

  contact: {
    title: "Contact Us",
    subtitle: "Get in touch with us for any questions or feedback!",
    address: {
      line1: "10 Meadow Row",
      city: "Buckingham",
      postcode: "MK18 1PU",
      phone: "+44 123 456 7890",
      email: "info@cocobubbletea.com",
    },
    map: {
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.3378296397827!2d-0.988372823652156!3d52.00072172454574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876e2be6321308b%3A0x74fd2a9afbc5bc80!2sMeadow%20Row%2C%20Buckingham%20MK18%201PU!5e0!3m2!1sen!2suk!4v1745696926032!5m2!1sen!2suk",
    },
  },

  // Default images for components
  images: {
    hero: "/images/default-hero.jpg",
    about: "/images/default-about.jpg",
    contact: "/images/default-contact.jpg",
    promo: "/images/default-promo.jpg",
    fallback: "/images/default-fallback.jpg",
  },
};

export default config;