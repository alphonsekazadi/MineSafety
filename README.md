# Mine Safety & Incident Tracker Dashboard

Mining operations in the DRC (Democratic Republic of Congo) face frequent safety challenges. **MineSafety** provides a digital platform for workers and managers to quickly log incidents, monitor risks, and visualize safety data—helping make mines safer, more transparent, and more responsive.

## 🚩 Problem Solved

Mining sites in the DRC often lack a streamlined, user-friendly system for reporting and analyzing safety incidents. Workers and supervisors need a fast, accessible way to:
- Log new incidents
- Track safety trends
- Identify high-risk zones
- Make data-driven decisions to improve workplace safety

## 🛠️ Core Features

- **Incident Submission Form:** Log incidents with details like location, type, severity, and date.
- **Real-Time Dashboard:** Visualize incidents in real time using KendoReact’s Grid, Charts (bar, pie), DatePicker, and DropDownList.
- **Heatmap Safety Reports:** Instantly see high-risk zones with a heatmap-style overview.
- **Worker-Friendly Chatbot Assistant:** Use natural language commands such as:
  - "Log a new incident"
  - "Show me incidents by severity"
- **Comprehensive UI Components:** Built with KendoReact, including Grid, Charts, Inputs, Dialog, DropDownList, DatePicker, TabStrip, Notification, Avatar, and more.

## 🚀 Tech Stack

- **Frontend:** React + TypeScript + Vite
- **UI Library:** [KendoReact](https://www.telerik.com/kendo-react-ui/) (Grid, Charts, Inputs, etc.)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) for rapid, responsive UI design
- **State & Data:** Modern React state management and hooks
- **Chatbot:** Custom worker assistant for conversational incident management

## 📁 Project Structure

```
MineSafety/
├── .gitignore
├── README.md
├── index.html
├── node_modules/
├── package-lock.json
├── package.json
├── public/
├── src/
│   ├── App.tsx
│   ├── Home.tsx
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── index.css
│   ├── main.tsx
│   ├── pages/
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```

- **src/assets/**: Images and static media assets
- **src/components/**: Reusable React components (UI elements, forms, dialogs, charts, etc.)
- **src/data/**: Static or mock data used in the app
- **src/pages/**: Page-level components/views
- **src/App.tsx**: Main application component
- **src/Home.tsx**: Home page/dashboard
- **src/main.tsx**: Vite entry point
- **src/index.css**: TailwindCSS and global styles

## 📸 Screenshots

*(Add annotated screenshots of your dashboard, incident form, heatmap, and chatbot here!)*

## 🔧 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Visit:** [http://localhost:5173](http://localhost:5173)

## 📝 Usage

- Log in as a worker or supervisor.
- Use the chatbot or the incident form to submit new reports.
- Explore incidents by date, severity, type, or location in the dashboard.
- Review the heatmap to identify and address high-risk zones.

## 📦 Available Scripts

- `npm run dev` – Start Vite development server
- `npm run build` – Build for production
- `npm run lint` – Run ESLint checks

## 👥 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📄 License

MIT

---

*Empowering safer mining through digital transparency and real-time data.*
