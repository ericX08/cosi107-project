import React, { useState, useEffect } from 'react';

function SuccessXSS() {
    const [content, setContent] = useState('');
    const [storedContent, setStoredContent] = useState('');

    useEffect(() => {
        // Fetch the stored content when the component mounts
        fetch('http://localhost:3001/get-content')
            .then(response => response.json())
            .then(data => {
                setStoredContent(data.content);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleInputChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:3001/submit-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        // Optionally fetch and update the displayed content after submission
    };

    return (
        <div>
            <h1>XSS Content Submission</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={content}
                    onChange={handleInputChange}
                    placeholder="Submit new content"
                />
                <button type="submit">Submit</button>
            </form>
            <div dangerouslySetInnerHTML={{ __html: storedContent }} />
        </div>
    );
}

export default SuccessXSS;
