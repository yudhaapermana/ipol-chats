import React, { useEffect } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_URL_API;

const RefreshToken = () => {
    const lgdata = JSON.parse(localStorage.getItem('userData') || 'null');

    const redirectToLoginFlow = () => {
        if (lgdata?.Keys && lgdata?.IP) {
            window.location.href = `/login/LoginWithKey/${lgdata.Keys}/${lgdata.IP}`;
        } else {
            localStorage.removeItem('userData');
            window.location.href = '/login/sessionExpired';
        }
    };

    const doRefresh = async () => {
        if (!lgdata?.UserTkn) {
            redirectToLoginFlow();
            return;
        }

        try {
            const response = await axios({
                url: `${URL}api/Utility/UpdateTkn`,
                method: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: lgdata,
                headers: { Keys: lgdata?.UserTkn }
            });

            if (response?.data) {
                localStorage.setItem('userData', JSON.stringify(response.data));
                const returnUrl = sessionStorage.getItem('returnUrlAfterRefresh') || '/chat';
                sessionStorage.removeItem('returnUrlAfterRefresh');
                window.location.href = returnUrl;
            } else {
                redirectToLoginFlow();
            }
        } catch (err) {
            console.error('Gagal refresh token:', err);
            redirectToLoginFlow();
        }
    };

    useEffect(() => {
        doRefresh();
    }, []);

    return <></>;
};

export default RefreshToken;