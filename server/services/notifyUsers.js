import cron from "node-cron";

import { sendEmail } from "../utils/sendEmail.js"; // assuming you already have this

import Borrow from "../models/borrowModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

export const notifyUsers = () => {
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Find all borrow records due within 24 hours, not yet returned, and not yet notified
      const borrowers = await Borrow.find({
        dueDate: { $lte: oneDayFromNow },
        returnDate: null,
        notified: { $ne: true },
      });

      for (const record of borrowers) {
        try {
          // Send notification email
          await sendEmail({
            email: record.user.email,
            subject: "Reminder: Book Due Soon - Kitabay",
            message: `Hello, \n\nThe book "${
              record.book.title
            }" you borrowed is due on ${record.dueDate.toDateString()}.\n\nPlease return it on time to avoid penalties.\n\nThanks,\nKitabay Library`,
          });

          // Mark as notified
          record.notified = true;
          await record.save();
        } catch (err) {
          console.error(
            `❌ Failed to send notification to ${record.user.email}`,
            err
          );
        }
      }

      console.log(`✅ Notifications sent: ${borrowers.length}`);
    } catch (error) {
      console.error("❌ Error in notifyUsers cron job:", error);
      throw new ErrorHandler("Notification cron failed", 500);
    }
  });
};
