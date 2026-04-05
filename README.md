## Kevin's Gym Management App 💪

<p align="center">
  <img src="./frontend/public/welcome_img.png" alt="Welcome Image">
</p>

Welcome to my gym management app.
This is a full-stack web application designed to help gym owners to manage gym members, gym course vendors and daily gym operations. It has role based access control, which allows Admins, Gym Members and Course Vendors to use the system based on their login account types.

---

### ✨ Main Features

- **Authentication & Authorization**: Secure login system with distinct panels for **Admins**, **Gym Members**, and **Course Vendors**.
- **CRUD Operations**: Full Create, Read, Update, and Delete functionality tailored for gym operations.
- **Beautiful UI**: Built with React and CSS for a modern, responsive design.
- **MongoDB Integration**: Robust backend to store all member and vendor data.

---

### 🚀 How to Run Locally

Please follow below steps to launch the app:

1. **Install Dependencies** 📦
   Open your terminal in the root directory and install everything at once using the handy script:

   ```powershell
   npm install -g concurrently
   npm run install-all
   ```

2. **Set up Environment Variables** ⚙️
   Create a `.env` file in the `backend` directory and add your MongoDB connection string and JSON Web Token secret:

   ```env
   PORT=6001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Start the Application** 🏃‍♂️
   Run following command in the root directory of the app:

   ```powershell
   npm run dev
   ```

4. **Enjoy!** 🎉
   The frontend will automatically pop up in your browser at `http://localhost:3000`.

   **Note**: This app is also hosted on my AWS EC2 instance. You can visit it at `http://3.25.108.170`.
