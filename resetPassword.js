// Script to reset a user's password
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  organizationName: String,
  contactInfo: String,
  resumeLink: String,
  badges: [String],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function resetPassword() {
  try {
    const email = 'test@example.com'; // Change this to your email
    const newPassword = 'password123'; // Change this to your desired password

    console.log('\n=== Resetting Password ===');
    console.log('Email:', email);
    console.log('New Password:', newPassword);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:', user.name);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log('Hashed password:', hashedPassword.substring(0, 30) + '...');

    // Update user password
    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    console.log('✅ Password reset successfully!');
    console.log('\nYou can now login with:');
    console.log('Email:', email);
    console.log('Password:', newPassword);

    // Verify the password works
    const updatedUser = await User.findOne({ email });
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('\n✅ Password verification:', isMatch ? 'SUCCESS' : 'FAILED');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPassword();
