const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'paypal', 'bank_transfer', 'stripe', 'mock', 'pending']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    paymentId: String,
    transactionId: String,
    processedAt: Date,
    method: String,
    error: String
  },
  refundDetails: {
    refundId: String,
    amount: Number,
    reason: String,
    processedAt: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['processing', 'completed', 'cancelled'],
    default: 'processing'
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.courses && this.courses.length > 0) {
    this.totalAmount = this.courses.reduce((total, course) => total + course.price, 0);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
