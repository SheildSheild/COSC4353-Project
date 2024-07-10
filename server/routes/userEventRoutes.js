import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

router.post('/signup', (req, res) => {
  const { userId, eventId } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (!user.acceptedEvents) {
    user.acceptedEvents = [];
  }

  const currentTime = new Date().toISOString();
  user.acceptedEvents.push({
    eventName: event.name,
    eventDate: event.date,
    signUpTime: currentTime,
  });

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  notifications.push({
    user: user.fullName,
    event: event.name,
    time: currentTime,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));

  res.status(200).json({ message: 'User signed up for event successfully' });
});

export default router;