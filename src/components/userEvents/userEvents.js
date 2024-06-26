import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import events from '../mockData/fake_event.json';
import dayjs from 'dayjs';
import './userEvents.css';

const UserEventPage = () => {
  const [value, setValue] = useState(new Date());
  const [userEvents, setUserEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user) {
      const filteredEvents = events.filter(event =>
        user.skills.some(skill => event.requiredSkills.includes(skill)) &&
        !user.acceptedEvents?.some(acceptedEvent => acceptedEvent.eventName === event.name && dayjs(acceptedEvent.eventDate).isSame(event.date, 'day'))
      );
      setUserEvents(filteredEvents);
    }
  }, [user]);

  const onDateChange = (date) => {
    setValue(date);
    setSelectedDate(date);
    const userAvailableEvents = events.filter(event =>
      user.skills.some(skill => event.requiredSkills.includes(skill)) &&
      dayjs(event.date).isSame(date, 'day')
    );
    setAvailableEvents(userAvailableEvents);
  };

  const onEventClick = (event) => {
    const matchedEvent = userEvents.find(e => e.date === dayjs(event.date).format('YYYY-MM-DD'));
    if (matchedEvent) {
      const isInAvailability = user.availability.some(range => {
        const [start, end] = range.split(' - ');
        return dayjs(matchedEvent.date).isAfter(start) && dayjs(matchedEvent.date).isBefore(end);
      });

      if (!isInAvailability) {
        if (!window.confirm('This event is outside your availability. Are you sure you want to sign up?')) {
          return;
        }
      }

      const updatedUser = { ...user };
      if (!updatedUser.acceptedEvents) {
        updatedUser.acceptedEvents = [];
      }
      const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      updatedUser.acceptedEvents.push({
        eventName: matchedEvent.name,
        eventDate: matchedEvent.date,
        signUpTime: currentTime,
      });

      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

      // Create a notifications
      const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
      notifications.push({
        user: user.fullName,
        event: matchedEvent.name,
        time: currentTime,
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));

      alert(`You have successfully signed up for ${matchedEvent.name} at ${currentTime}`);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const event = userEvents.find(e => e.date === dayjs(date).format('YYYY-MM-DD'));
      if (event) {
        return (
          <div className="event">
            <span>{event.name}</span>
          </div>
        );
      }
    }
  };

  return (
    <div className="user-event-page">
      <br />
      <br />
      <br />
      <br />
      <div className="calendar-container">
        <Calendar
          onChange={onDateChange}
          value={value}
          tileContent={tileContent}
          onClickDay={onEventClick}
        />
      </div>
      {selectedDate && availableEvents.length > 0 && (
        <div className="events-list">
          <h3>Events on {dayjs(selectedDate).format('MMMM D, YYYY')}</h3>
          <ul>
            {availableEvents.map(event => (
              <li key={event.id}>
                {event.name} - {event.description} <button onClick={() => onEventClick(event)}>Sign Up</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserEventPage;
