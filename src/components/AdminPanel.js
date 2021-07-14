import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import AdminUsersTable from './AdminUsersTable';
import AdminEmailTable from './AdminEmailsTable';
import AdminPositionsControl from './AdminPositionsControl';

export default function AdminPanel() { //פונקציה ראשית של אדמין
  const [view, setView] = useState(''); //סטייט שבודק מה האדמין רוצה לראות

  const handleViewChange = (value) => { //פונקציה שבודקת במה האדמין רוצה לצפות (משתמשים, הודעות, פוזיציות)
    setView(value); //עדכון הסטייט לפי מה שבחר האדמין
  }

  return (
    <div>
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{
            fontSize: '15px',
            position: 'relative',
          }}
          onClick={() => handleViewChange('messages')} //משנה את הטבלה להודעות בלחיצה
        >
          View Messages
          </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            fontSize: '15px',
            position: 'relative',
            left: '40px'
          }}
          onClick={() => handleViewChange('users')} //משנה את הטבלה למשתמשים בלחיצה
        >
          View Users
          </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            fontSize: '15px',
            position: 'relative',
            left: '80px'
          }}
          onClick={() => handleViewChange('positions')} //משנה את הטבלה לפוזיציות בלחיצה
        >
          View All Positions
          </Button>
      </div>
      <div>
        {/* החלק הזה קורה רק במידה והאדמין רוצה לראות הודעות */}
        {view === 'messages' && <AdminEmailTable />}
        {/* החלק הזה קורה רק במידה והאדמין רוצה לראות את המשתמשים */}
        {view === 'users' && <AdminUsersTable />}
        {view === 'positions' && <AdminPositionsControl />}
      </div>
    </div>
  )
};

