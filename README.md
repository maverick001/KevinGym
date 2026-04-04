## Kevin's Gym Management App 💪

Welcome to My Gym Management App, a full-stack web application designed to help gym owners manage gym members, gym course vendors and daily gym operations. This app has role based access control, allowing Admins Gym Members and Course Vendors to use the system based on their login account types.

### ✨ Main Features

- **Authentication & Authorization**: Secure login system with distinct panels for **Admins**, **Gym Members**, and **Course Vendors**.
- **CRUD Operations**: Full Create, Read, Update, and Delete functionality tailored for gym operations.
- **Beautiful UI**: Built with React and Tailwind CSS for a modern, responsive design.
- **MongoDB Integration**: Robust backend to store all member and vendor data.

---

### 🚀 How to Run Locally

Follow these magical steps to get the app running on your machine:

1. **Install Dependencies** 📦
   Open your terminal in the root directory and install everything at once using the handy script:

   ```powershell
   npm run install-all
   ```

   _(If you encounter an issue during setup where `concurrently` isn't found, simply run `npm install -g concurrently` first!)_

2. **Start the Application** 🏃‍♂️
   Fire up both the backend and frontend at the same time:

   ```powershell
   npm run dev
   ```

3. **Enjoy!** 🎉
   The frontend will automatically pop up in your browser (usually at `http://localhost:3000`).
