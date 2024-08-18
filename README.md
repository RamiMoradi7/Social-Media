# Fullstack Application

Social Media Platform: Created a Facebook-like application using React, Redux, and Node.js with TypeScript. This project involved implementing real-time notifications and scalable data management with MongoDB.
## 🚀 Features

 **Social Media Platform**: Developed a comprehensive social media platform simillar to Facebook using React Redux for state management and Node.js with TypeScript for backend services.
- **Real-Time Notifications**: Implemented a real-time notification system to keep users informed of new activities and interactions.
- **Scalable Data Management**: Utilized MongoDB for efficient and scalable data management, ensuring the platform can handle growing user data effectively.
- **Real-Time Communication**: Integrated WebSocket for real-time communication, enabling instant messaging and updates, alongside a REST API for reliable data access.
- **Responsive Design**: Focused on delivering high-quality user experiences with a responsive design, ensuring the application is accessible and functional across various devices.
- **Object-Oriented Programming**: Used Object-Oriented Programming (OOP) principles to create modular, reusable, and maintainable code.
- **Component Lifecycle Management**: Managed component lifecycles effectively to optimize performance and ensure seamless user interactions.

## 📂 Project Structure

- **Frontend**: Located in the `frontend/` directory.
- **Backend**: Located in the `backend/` directory.

## 🔧 Getting Started

### Prerequisites

- Node.js (version 16.x or later)
- npm or Yarn
- MongoDB (local or remote)

### Backend Setup

1. **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the `backend/` directory and configure the required variables. Example `.env` file:

    ```plaintext
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/mydatabase
    JWT_SECRET=mysecretkey
    ```

4. **Run the backend server:**

    ```bash
    npm start
    ```

### Frontend Setup

1. **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the `frontend/` directory and configure the required variables. Example `.env` file:

    ```plaintext
    REACT_APP_API_URL=http://localhost:4000/api
    ```

4. **Run the frontend application:**

    ```bash
    npm start
    ```

## 📦 Scripts

### Backend Scripts

- `npm start`: Start the backend server using `nodemon` with `ts-node`.

### Frontend Scripts

- `npm start`: Start the development server.
- `npm build`: Build the production-ready frontend application.
- `npm test`: Run the frontend tests.
- `npm eject`: Eject the Create React App configuration (use with caution).

## 🌐 Deployment

For deployment, ensure the following:

1. Configure environment variables for production.
2. Build the frontend using `npm run build`.
3. Serve the built frontend and connect it with the backend.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

[Rami Moradi](https://github.com/RamiMoradi7)

## 📬 Contact

For any questions or support, please reach out to [Ramimoradilg4@gmail.com](Ramimoradilg4@gmail.com).

