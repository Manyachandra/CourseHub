#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

// Import Course model
const Course = require('../models/Course');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Update course prices to INR
const updatePricesToINR = async () => {
  try {
    console.log('🔄 Starting price update to INR...');
    
    // Get all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses to update`);
    
    let updatedCount = 0;
    
    for (const course of courses) {
      // Convert USD prices to INR (roughly 1 USD = 83 INR)
      // Set prices to either ₹500 or ₹1000 based on original price
      let newPrice, newOriginalPrice;
      
      if (course.originalPrice && course.originalPrice > 0) {
        // If there's an original price, use it to determine the new price
        if (course.originalPrice <= 15) {
          newOriginalPrice = 1000; // $15 or less becomes ₹1000
          newPrice = 500; // Sale price becomes ₹500
        } else {
          newOriginalPrice = 1500; // $16+ becomes ₹1500
          newPrice = 1000; // Sale price becomes ₹1000
        }
      } else {
        // No original price, base on current price
        if (course.price <= 15) {
          newPrice = 500; // $15 or less becomes ₹500
        } else {
          newPrice = 1000; // $16+ becomes ₹1000
        }
        newOriginalPrice = newPrice; // No discount
      }
      
      // Update the course
      await Course.findByIdAndUpdate(course._id, {
        price: newPrice,
        originalPrice: newOriginalPrice
      });
      
      console.log(`✅ Updated: ${course.title} - $${course.price} → ₹${newPrice}`);
      updatedCount++;
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} courses to INR`);
    console.log('💰 New pricing structure:');
    console.log('   - Basic courses: ₹500');
    console.log('   - Premium courses: ₹1000');
    console.log('   - Original prices: ₹1000-1500');
    
  } catch (error) {
    console.error('❌ Error updating prices:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await updatePricesToINR();
    console.log('✅ Price update completed successfully');
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  }
};

// Run the script
main();
