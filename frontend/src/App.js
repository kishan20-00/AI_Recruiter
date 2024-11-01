// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JobPostForm from './components/JobPostForm';
import JobPostList from './components/JobPostList';
import JobPostDetail from './components/JobPostDetail';
import ApplicationList from './components/ApplicationList';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
    const [token, setToken] = useState(null);

    return (
        <Router>
            <div>
                {!token ? (
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Login setToken={setToken} />} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/" element={<JobPostList setToken={setToken} />} /> {/* Pass setToken prop */}
                        <Route path="/add-job" element={<JobPostForm />} />
                        <Route path="/job/:id" element={<JobPostDetail />} />
                        <Route path="/applications" element={<ApplicationList setToken={setToken} />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
};

export default App;
