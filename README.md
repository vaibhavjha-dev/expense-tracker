# Expense Tracker

A sleek, modern, and feature-packed **Expense Tracker** built with **Next.js** to help you stay in control of your finances. Track spending, visualize trends, and manage your money with an intuitive interface designed for all devices.

**Live App:** https://exptrack.vaibhavjha.dev/

---

## 🚀 Features

### 🔹 Dashboard Overview  
View a real‑time summary of:
- Total balance  
- Total income  
- Total expenses  

### 🔹 Transaction Management  
Easily **add**, **edit**, and **delete** transactions:
- Supports income and expenses  
- Categorize and label your entries  
- Smooth and responsive interactions  

### 🔹 Visual Analytics  
Interactive charts powered by **Recharts** help you:
- Identify spending patterns  
- Monitor income vs. expense trends  
- Understand where your money goes  

### 🔹 Data Persistence  
Your data is securely stored **locally in your browser** using localStorage:
- No backend required  
- Your privacy is ensured  
- Data persists across sessions  

### 🔹 Import / Export Data  
Backup and restore your financial data anytime:
- Export transactions as a file  
- Import saved data seamlessly  

### 🔹 PDF Report Export  
Generate a detailed **PDF report** using:
- jsPDF  
- jsPDF AutoTable  

### 🔹 Internationalization (i18n)  
Built‑in language support for:
- **English**
- **Hindi**
- **German**
- **French**
- **Spanish**

Includes **Indian currency formatting** (Lakhs / Crores).

### 🔹 Themes & UI  
- Dark / Light mode toggle  
- Fully responsive UI (Desktop, Tablet, Mobile)  
- Elegant design using **Tailwind CSS**  
- Reusable, accessible components from **Shadcn UI**  
- Smooth animations via **Framer Motion**  

### 🔹 PWA Support  
Install the app on your device for a native-like experience:
- Offline support  
- App icon & splash screen  
- Fast loading  

---

## 🛠️ Tech Stack

| Category | Tech |
|---------|------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| UI Library | Shadcn UI |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| PDF Generation | jsPDF & jsPDF-AutoTable |
| State / Storage | LocalStorage |
| Language Support | i18n |

---

## 📁 Project Structure

```
expense-tracker/
├── src/
│   ├── app/            # App Router pages & layouts
│   ├── components/     # Reusable and feature-specific UI components
│   ├── hooks/          # Custom React hooks (e.g., useLocalStorage)
│   ├── lib/            # Utility functions & helpers
│   ├── messages/       # i18n translation files
├── public/             # Static assets (icons, images)
└── README.md
```

---

## 🧩 Getting Started

### ✔️ Prerequisites
- Node.js **18+**
- Package manager: npm / yarn / pnpm / bun

### 📦 Installation

```bash
git clone <repository-url>
cd expense-tracker
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### ▶️ Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Now visit:  
👉 http://localhost:3000

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use, improve, and distribute it.

---

## 💡 Contributing

Contributions are welcome!  
If you'd like to add features or improvements:
1. Fork the repo  
2. Create a new branch  
3. Submit a pull request  

---

## ❤️ Acknowledgements

Special thanks to the creators of:
- Next.js  
- Tailwind CSS  
- Shadcn UI  
- Recharts  
- jsPDF  
- Framer Motion  

---

Enjoy tracking your expenses with clarity and style! 🎉
