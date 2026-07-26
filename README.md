# SCBS - Shantichakra Blood Society Sunamganj

<div align="center">

![SCBS Logo](https://via.placeholder.com/100x100/E11D2E/FFFFFF?text=SCBS)

**Together We Save Lives**

A digital platform for connecting blood donors with patients in need, built for Shantichakra Blood Society Sunamganj.

</div>

---

## 🎯 About

SCBS Digital Platform is a non-profit humanitarian blood donation support website that helps connect blood donors with patients in the Sunamganj district of Bangladesh.

### Key Features

- 🩸 **Blood Request System** - Submit blood requests without login
- 👥 **Donor Registration** - Register as a blood donor
- 🙋 **Volunteer Registration** - Join as a volunteer
- 📅 **Event Management** - View upcoming blood donation events
- 📰 **News & Updates** - Stay informed about blood donation campaigns
- 📱 **Social Sharing** - Share requests on WhatsApp and Facebook
- 🔒 **Privacy First** - Donor contact info protected

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Cloudinary |
| Hosting | Vercel |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shantichakrabloodsocietysunamganj/Shantichakrabloodsocietysunamganj.git
cd scbs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
scbs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── blood-request/     # Blood request pages
│   │   ├── donors/            # Donor pages
│   │   ├── volunteer/         # Volunteer pages
│   │   └── admin/             # Admin panel
│   ├── components/            # React components
│   │   ├── ui/                # UI components
│   │   └── layout/            # Layout components
│   └── lib/                   # Utilities
│       ├── supabase.ts        # Supabase client
│       └── utils.ts           # Helper functions
├── public/                    # Static files
└── ...
```

---

## 🗄️ Database Setup

### Supabase Tables

Create the following tables in your Supabase project:

1. **blood_requests** - Blood donation requests
2. **donors** - Registered blood donors
3. **volunteers** - Registered volunteers
4. **events** - Upcoming events
5. **news** - News and blog posts
6. **contact** - Contact form submissions

See `docs/database-schema.sql` for full schema.

---

## 🌐 Free Hosting Guide

### Vercel (Frontend + API)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy!

### Supabase (Database)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your URL and anon key
4. Add to Vercel environment variables

### Cloudinary (File Storage)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your cloud name and API keys
4. Add to environment variables

---

## 📝 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with stats and recent requests |
| Blood Request | `/blood-request` | Submit blood request |
| Donors | `/donors` | Search blood donors |
| Donor Register | `/donors/register` | Register as donor |
| Volunteer | `/volunteer` | Volunteer registration |
| Events | `/events` | Upcoming events |
| News | `/news` | Latest news |
| Contact | `/contact` | Contact form |

---

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#E11D2E` | CTAs, Blood theme |
| Navy Blue | `#0B4F9C` | Headers, Professional |
| Success Green | `#10B981` | Success states |
| Warning Amber | `#F59E0B` | Warnings |
| Error Red | `#EF4444` | Errors |

### Typography

- Bengali: Noto Sans Bengali
- English: Inter

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Developed by **Rahat** | Student & Educator

> "Building technology that serves humanity."

- Facebook: [facebook.com/rahat.ahmed.948943](https://www.facebook.com/rahat.ahmed.948943)
- WhatsApp: [wa.me/8801626224878](https://wa.me/8801626224878)

---

## 📞 Contact

**Shantichakra Blood Society Sunamganj**

- Phone: +880 1792-456922
- Email: contact@scbs.org
- Address: জীবধারা বাজার, শান্তিগঞ্জ, সুনামগঞ্জ

---

<div align="center">

**Made with ❤️ for the people of Sunamganj**

</div>
