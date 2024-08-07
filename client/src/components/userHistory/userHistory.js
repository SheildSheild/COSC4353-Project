import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './userHistory.css';

const UserHistory = () => {
  const [userHistory, setUserHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3000/api/history/${user.id}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setUserHistory(data);
          }
        })
        .catch(error => console.error('Error fetching user history:', error));
    }
  }, [user]);

  const getStatus = (eventDate) => {
    const today = dayjs();
    const dateOfEvent = dayjs(eventDate);
    
    if (dateOfEvent.isAfter(today, 'day')) {
      return "Scheduled";
    } else if (dateOfEvent.isSame(today, 'day')) {
      return "Active";
    } else {
      return "Complete";
    }
  };
  
  return (
    <div className="user-history-page">
      <br />
      <br />
      <h2>My Volunteer History</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Date</th>
              <th>Sign-Up Time</th>
              <th>Skills</th>
              <th>Location</th>
              <th>Description</th>
              <th>Participation Status</th>
            </tr>
          </thead>
          <tbody>
            {userHistory.length > 0 ? (
              userHistory.map((event, index) => (
                <tr key={index}>
                  <td>{event.eventName || 'N/A'}</td>
                  <td>{dayjs(event.eventDate).format('MMMM D, YYYY') || 'N/A'}</td>
                  <td>{dayjs(event.signUpTime).format('MMMM D, YYYY HH:mm:ss')}</td>
                  <td>{event.skills || 'N/A'}</td>
                  <td>{event.location || 'N/A'}</td>
                  <td>{event.description || 'N/A'}</td>
                  <td>{getStatus(event.eventDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No events signed up yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHistory;
