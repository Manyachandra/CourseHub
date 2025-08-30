# CourseHub - Online Course Purchase Website

A fully functional course purchase website built with Node.js, Express, Next.js, and MongoDB. This platform allows users to browse courses, add them to cart, complete purchases, and manage their learning journey.

## 🚀 Features

### Core Functionality
- **Course Listing & Discovery**: Browse courses with advanced filtering and search
- **Dynamic Filtering**: Filter by category, price range, rating, level, and more
- **Course Details**: Comprehensive course information with curriculum and instructor details
- **Shopping Cart**: Add/remove courses, manage quantities, and view totals
- **Checkout System**: Multi-step checkout with billing and payment processing
- **User Authentication**: Secure registration, login, and session management
- **Order Management**: Track purchase history and order status
- **Review System**: Rate and review courses after purchase

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Dynamic course filtering without page reloads
- **Session Management**: Secure session-based authentication
- **Input Validation**: Comprehensive form validation and error handling
- **API Integration**: RESTful API with proper error handling
- **Database Indexing**: Optimized queries for better performance

### Admin Features
- **Course Management**: Create, edit, and delete courses
- **User Management**: View and manage user accounts
- **Order Management**: Track and update order statuses
- **Role-based Access Control**: Secure admin interface

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **Express Session**: Session management
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **nodemailer**: Email functionality
- **CORS**: Cross-origin resource sharing

### Frontend
- **Next.js**: React framework
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Axios**: HTTP client
- **React Icons**: Icon library
- **React Hot Toast**: Toast notifications
- **Framer Motion**: Animation library

## 📁 Project Structure

```
Course-App/
├── server/                 # Backend server
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── client/                # Frontend application
│   ├── components/        # React components
│   ├── pages/             # Next.js pages
│   ├── styles/            # CSS and Tailwind config
│   ├── utils/             # Utilities and API services
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Course-App
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/course_website
   SESSION_SECRET=your_session_secret_here
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   EMAIL_SERVICE=gmail
   ```

5. **Database Setup**
   
   Ensure MongoDB is running and create a database named `course_website`

6. **Start the application**
   
   **Option 1: Run both servers simultaneously**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   **Option 2: Run servers separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses` - Get all courses with filtering
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `GET /api/courses/categories` - Get course categories
- `GET /api/courses/levels` - Get course levels
- `POST /api/courses/:id/reviews` - Add course review

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add course to cart
- `DELETE /api/cart/remove/:courseId` - Remove course from cart
- `DELETE /api/cart/clear` - Clear cart
- `GET /api/cart/total` - Get cart total

### Orders
- `POST /api/orders` - Create order
- `POST /api/orders/:orderId/payment` - Process payment
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## 🎨 Customization

### Styling
- Modify `client/tailwind.config.js` to customize colors and theme
- Update `client/styles/globals.css` for global styles
- Use Tailwind utility classes for component styling

### Features
- Add new course categories in `server/models/Course.js`
- Implement real payment processing (Stripe/PayPal)
- Add file upload functionality for course thumbnails
- Implement course progress tracking

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: Secure session cookies with MongoDB storage
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Role-based Access**: Admin-only routes and functionality
- **SQL Injection Protection**: Mongoose ODM prevents injection attacks

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind CSS:
- Responsive grid layouts
- Mobile-optimized navigation
- Touch-friendly interface elements
- Adaptive typography and spacing

## 🧪 Testing

To run tests (when implemented):
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- **Real-time Features**: WebSocket integration for live updates
- **Advanced Analytics**: Course performance and user behavior tracking
- **Mobile App**: React Native mobile application
- **Video Streaming**: Integrated video player for course content
- **Social Features**: User profiles, following, and course sharing
- **AI Recommendations**: Personalized course suggestions
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Search**: Elasticsearch integration for better search

---

**Built with ❤️ using modern web technologies**
