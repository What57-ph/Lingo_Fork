import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

const HomePage = () => {
    const { loginGoogle } = useContext(AuthContext);
    const [code, setCode] = useState(null);

    useEffect(() => {
        const url = window.location.href;
        const params = new URL(url).searchParams;
        const value = params.get('code');
        setCode(value);
        if (value) {
            async function fetchLogin() {
                const successLogin = await loginGoogle(value);
            }
            fetchLogin();
        }

        history.replaceState({}, null, "/");
    }, []);

    return (
        <div>
        </div>
    );
};

export default HomePage;