# 🛒 SwaadSupplier – Raw Material Sourcing Platform for Street Food Vendors

## 🚀 About the Project

SwaadSupplier is a full-stack platform developed for Tutedude's Web Development Hackathon 1.0. It empowers India's street food vendors to source quality raw materials directly from local, verified suppliers at competitive prices.

The platform bridges the gap between vendors and suppliers, offering AI-powered ingredient estimation, smart order allocation, real-time inventory management, and a blockchain-based trust system to ensure transparency and quality in the sourcing process.

## 🧠 Problem Statement

Street food vendors often face critical challenges:

- Inconsistent quality of raw materials
- High and unpredictable pricing
- Difficulty accessing verified, reliable suppliers
- Manual effort in estimating raw material requirements and placing orders

SwaadSupplier addresses these issues through:

- ✅ Gemini-powered AI for smart ingredient planning
- ✅ Blockchain-backed supplier verification and rating system
- ✅ A shared digital marketplace
- ✅ Real-time inventory and smart delivery management

## 🎯 Core Features

### 👨‍🍳 Vendor Side

*Secure Sign-Up/Login*: JWT-based login system tailored for vendors. Streamlined and mobile-friendly UI for easy access.

*AI-based Order Generator*: Vendors input dishes and servings; Gemini calculates exact raw material quantities, buffer margins, and storage tips.

*Smart Supplier Selector*: Suggests suppliers based on proximity, price, and past ratings using a matchmaking algorithm.

*One-Click Order Placement*: Place orders instantly, track progress live, and receive confirmations via dashboard notifications.

*Reusable Templates*: Save frequently used orders for quick reuse, reducing repetition.

*Order History Tracking*: View all past transactions with date, quantity, supplier, and blockchain reference (if available).

### 🏪 Supplier Side

*Supplier Onboarding with FSSAI Upload*: Suppliers must upload a valid FSSAI Certificate (PDF or image) during registration to ensure food safety compliance.

*Product & Pricing Management*: Easily add, update, and manage product listings with stock quantity and price per unit.

*Order Management Dashboard*: View incoming orders from vendors, accept or decline them, and update status (Processing, Shipped, Delivered).

*Analytics & Metrics*: See performance insights like completed orders, top-selling items, and average delivery time.

### 🏬 Marketplace (Shared Page)

A common space where vendors and suppliers can interact.

*Category-based Browsing*: Browse suppliers by ingredients like Veggies, Spices, Meat, Dairy, Oils, and Snacks.

*Advanced Search Filters*: Filter by location, rating, price range, or delivery time.

*Supplier Listings*: View detailed supplier cards showing:
- Supplier Name & Verification Badge
- Product types offered (e.g., Garam Masala, Milk, Onions)
- Pricing range and minimum order value
- Real-time availability, delivery zones, and estimated time
- ⭐ Ratings, Reviews, and Special Offers

### 🤝 Community Page – Blockchain Trust System

*MetaMask Wallet Integration*: Users can connect their Ethereum wallet to access on-chain trust data.

*Transparent Ratings*: Supplier reviews are stored immutably on the blockchain to prevent tampering.

*Stats Dashboard*: Shows total suppliers, reviews, verified entities, and trust ratings.

*Supplier Ratings*: View decentralized reviews such as:
- Digital Innovations Inc – 4.8★ (31 reviews)
- Global Manufacturing Ltd – 4.2★ (18 reviews)

*Add New Supplier (Decentralized Form)*: Enter name, description, contact, and publish to the blockchain ledger.

### 📬 Support Page

A minimal, clean feedback form allowing users to:
- Submit name, email, and message
- Send feedback, complaints, or suggestions
- Get instant toast-based success messages on form submission

## 🧠 AI Features – Gemini-Powered Order Generator

*Indian Street Food Intelligence*: Understands dishes like Dosa, Vada Pav, Samosa, Chole Bhature, etc.

*Ingredient Estimation*: Calculates accurate quantity of each raw material required for selected servings.

*Smart Buffering*: Adds safety margins for spoilage, wastage, or bulk preparation.

*Supplier Recommendations*: Recommends optimal suppliers based on cost-efficiency and locality.

*Cost & Shelf-Life Analysis*: Explains pricing breakdown, expected shelf-life, and best storage conditions for ingredients.

*Market Insights*: Highlights seasonal trends and ingredient cost fluctuations.



## 💻 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Blockchain | Solidity (Hardhat, Ethers.js), MetaMask |
| AI Layer | Gemini Pro (Prompt-based inference) |
| Authentication | JWT-based login |
| Hosting | Vercel (Frontend), Render (Backend) |

## 📸 Screenshots


| Home Page | Marketplace Page | AI Order Generator |
|-----------|------------------|-------------------|
| ![Home](/screenshots/Screenshot%202025-07-27%20211124.png) | ![Marketplace](/screenshots/Screenshot%202025-07-27%20211226.png) | ![AI Generator](/screenshots/Screenshot%202025-07-27%20211308.png) |

| Blockchain Page | Supplier Signup (FSSAI Upload) | Dashboard |
|----------------|--------------------------------|-----------|
| ![Blockchain](/screenshots/blockchain1.jpg) | ![FSSAI Upload](/screenshots/blockchain2.jpg) | ![Dashboard](/screenshots/Screenshot%202025-07-27%20211503.png) |

## 📽 Demo Video

🎥 [Watch Demo Video]((https://drive.google.com/drive/folders/14meiS6N_lTxO6VRSeWqIdBFesfxU0GTz?usp=drive_link))

## 🔗 Live Demo

🌐 [Try the Live App](https://swaad-supplier.vercel.app/)

## 🔐 Test Credentials

Use these pre-registered accounts to test the platform:

**Vendor Accounts:**
- Email: `raju123@gmail.com` | Password: `raju123`
- Email: `shane123@gmail.com` | Password: `shane123` 
- Email: `xyz@gmail.com` | Password: `123456`

**Supplier Accounts:**
- Email: `jacell@gmail.com` | Password: `jacell123`
- Email: `serene@gmail.com` | Password: `123456`

> ℹ️ Please don't modify account details. These are for testing purposes only.

## 📁 GitHub Repository

🛠 [View the Full Source Code](INSERT_GITHUB_URL)

## 👥 Team Members

| Name | Role | Contributions |
|------|------|---------------|
| Jacell Jamble | Fullstack Developer | AI Order Generator, UI Design, Blockchain Integration |
| Shane Dias | Backend Developer | API Development, Order Lifecycle, MongoDB Schemas |
| Serene Dmello | Backend Developer | API Development, Order Lifecycle, MongoDB Schemas |
| Shubham Adhkale | UI/UX Designer | Application Flow, Responsive Design, Demo Assets |
| Alok Sinha | Product Lead | Feature Planning, Testing, Pitch, Community Page Logic |

## 🛠 Future Improvements

- 💸 UPI and Razorpay integration for payment options
- 📱 Mobile-first Progressive Web App (PWA)
- 🗺 Real-time Geo-mapping for suppliers & delivery tracking
- 🔊 Voice assistant interface for illiterate vendors
- 📤 WhatsApp-based order placement & notifications
- 📃 PDF Invoice generation for every transaction

## 📣 Submission Checklist

- ✅ Demo Video: [https://drive.google.com/drive/folders/14meiS6N_lTxO6VRSeWqIdBFesfxU0GTz?usp=drive_link]
- ✅ Live Website: [https://swaad-supplier.vercel.app/]
- ✅ GitHub Repo: [https://github.com/Shane-Dias/SwaadSupplier]
- ✅ Final README: ✅ This File

## 🙌 Acknowledgements

- 💡 Thanks to Tutedude for organizing the hackathon
- 🤖 Gemini AI for powering the intelligent order generator
- 🛠 OpenAI's ChatGPT for development support
- 👨‍🍳 India's street food vendors who inspired this mission

---

Built with ❤ for India's street food ecosystem
