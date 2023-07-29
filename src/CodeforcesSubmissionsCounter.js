import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CodeforcesSubmissionsCounter.css';

const CodeforcesSubmissionsCounter = ({ apiKey }) => {
  const [username, setUsername] = useState('');
  const [day, setDay] = useState(new Date());
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const getAcceptedSubmissions = async (username, day) => {
    const api_url = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`;
    const headers = { Authorization: `Bearer ${apiKey}` };
    let response = await axios.get(api_url, headers);
    let data = response.data;
    let accepted_submissions = 0;

    if (data.status === 'OK') {
      let all_submissions = data.result;

      while (all_submissions.length === 10000) {
        let last_submission_id = all_submissions[all_submissions.length - 1].id;
        response = await axios.get(`${api_url}&from=${last_submission_id + 1}`, headers);
        data = response.data;
        all_submissions.push(...data.result);
      }

      // Convert day to UTC
      const dayUTC = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));

      for (let submission of all_submissions) {
        let creation_time = new Date(submission.creationTimeSeconds * 1000);
        if (submission.verdict === 'OK' && dayUTC <= creation_time && creation_time < new Date(dayUTC.getTime() + 86400000)) {
          accepted_submissions++;
        }
      }
    }

    return accepted_submissions;
  };

  const countSubmissions = async () => {
    try {
      const accepted_submissions = await getAcceptedSubmissions(username, day);
      setResult(`Number of accepted submissions on ${day.toISOString().slice(0,10)}: ${accepted_submissions}`);
      setError(null);
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  return (
    <div className="container">
      <img className="logo" src="https://codeforces.org/s/78220/images/codeforces-sponsored-by-ton.png" alt="Codeforces Logo" />
      <h2>Codeforces Accepted Submissions Counter</h2>
      
      <label htmlFor="username">Codeforces Username:</label>
      <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ fontSize: '21px' }} />

      <label htmlFor="date">Date:</label>
      <DatePicker id="date" selected={day} onChange={date => setDay(date)} customInput={<input style={{ fontSize: '21px' }} />} />

      <button onClick={countSubmissions}>Count Submissions</button>

      {result && <p className="result">{result}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CodeforcesSubmissionsCounter;
