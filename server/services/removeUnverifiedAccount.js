import cron from "node-cron";
import User from "../models/userModel.js";

export const removeUnverifiedAccount = () => {
  // Run every day at midnight
  cron.schedule("*/5 * * * *", async () => {
    try {
      const timeAgo = new Date(Date.now() - 30 * 60 * 1000);

      // Assuming you have a User model and a method to delete unverified users
      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: timeAgo },
      });

      console.log(`✅ Unverified accounts removed: ${result.deletedCount}`);
    } catch (error) {
      console.error("❌ Error in removeUnverifiedAccount cron job:", error);
    }
  });
};
