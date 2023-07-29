import React from 'react';
import CodeforcesSubmissionsCounter from './CodeforcesSubmissionsCounter';

const App = () => {
  return (
    <div>
      <CodeforcesSubmissionsCounter apiKey={process.env.REACT_APP_API_KEY} />
    </div>
  );
};

export default App;
