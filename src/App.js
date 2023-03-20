import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components'; 
import { Button, CircularProgress } from '@mui/material';
import { CancelOutlined, CheckCircleOutlineOutlined, PlayArrowRounded, WarningOutlined} from '@mui/icons-material';
import "./index.css";
import axios from 'axios';


const fadeIn = keyframes `from { opacity: 0; } to { opacity: 1; }`;

const Container = styled.div`display: flex; flex-direction: column; align-items: center; justify-content: center; animation: ${fadeIn} 1s ease-in;`;

const Link = styled.a `color: #3f51b5; text-decoration: none; font-weight: bold; &:hover { text-decoration: underline; }`;


function App() {
  const [linkStatuses, setLinkStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState(false);



  const handleCheckLinks = async () => {
    setLoading(true); // changer le state de loading
    const response = await fetch('https://tes-url.onrender.com/links');
    const result = await response.json();
    setTimeout(() => {
      setLoading(false);
      setLinkStatuses(result);
      startAnimation(); // lancer l'animation
    }, 2000);
  };
  
  function startAnimation() {
    setAnimation(true);
    const intervalId = setInterval(() => {
      setAnimation(false);
      clearInterval(intervalId);
    }, 3000);
  }
  
return (
  <div className='App-header ' >
<Container>
<Button onClick={handleCheckLinks} variant="contained" color="primary" startIcon={<PlayArrowRounded />} style={{ marginTop: '10px' }}>
Vérifier les URLs
</Button>
  {loading ? (
    <CircularProgress color="primary" />
  ) : (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '16px' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px', fontSize: '14pt' }}>N°</th>
          <th style={{ border: '1px solid black', padding: '8px', fontSize: '12pt' }}>URL</th>
          <th style={{ border: '1px solid black', padding: '8px', fontSize: '12pt' }}>Statut</th>
        </tr>
      </thead>
      <tbody>
        {linkStatuses.map((linkStatus, index) => (
          <tr key={linkStatus.id}>
            <td style={{ border: '1px solid black', padding: '8px', fontSize: '12pt', textAlign: 'center' }}>
              {index + 1}
            </td>
            <td style={{ border: '1px solid black', padding: '8px', fontSize: '12pt' }}>
              <Link href={linkStatus.link} target="_blank" style={{ fontSize: '12pt' }}>
                {linkStatus.link.includes('/lm_auth_proxy?') ? linkStatus.link.replace(/\/lm_auth_proxy?.*/g, '') : linkStatus.link}
              </Link>
             {linkStatus.link === 'https://envoludia.neocles.com' && linkStatus.status === 'Cliquez sur le lien' ? (
                <span style={{ fontStyle: 'italic', color: 'gray', fontSize: '12pt' }}> </span>
              ) : null}
            </td>
            <td style={{ border: '1px solid black', padding: '8px', fontSize: '12pt' }}>
              {linkStatus.status === "success" ? (
                <CheckCircleOutlineOutlined
                  style={{
                    color: 'green',
                    fontWeight: 'bold',
                    marginRight: '8px',
                    animation: animation ? 'checkmark 1s forwards' : '',
                  }}
                />
              ) : (
                <>
                  {linkStatus.link === 'https://envoludia.neocles.com' && linkStatus.status === 'Cliquez sur le lien' ? (
                    <>
                      <WarningOutlined
                        style={{ color: 'orange', fontWeight: 'bold', marginRight: '8px' }}
                      />
                      <span style={{ fontStyle: 'italic', color: 'gray', fontSize: '12pt' }}>
                        - Ce lien est à vérifier sur bastion
                      </span>
                    </>
                  ) : (
                    <>
                      <CancelOutlined
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                          marginRight: '8px',
                          animation: animation ? 'crossmark 1s forwards' : '',
                        }}
                      />
                      <span style={{ fontStyle: 'italic', color: 'gray', fontSize: '12pt' }}>
                        "{linkStatus.status}"
                      </span>
                    </>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</Container>
</div>
);
}

export default App;