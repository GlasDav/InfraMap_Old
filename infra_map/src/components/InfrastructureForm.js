import React, { useState } from 'react';

const InfrastructureForm = ({ addInfrastructure }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addInfrastructure({ name, type });
        setName('');
        setType('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
            />
            <button type="submit">Add Infrastructure</button>
        </form>
    );
};

export default InfrastructureForm;
