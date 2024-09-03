"use client"; // This makes the component a Client Component

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from '../app/nav.module.css';

const notifyUser = (command) => {
  alert(`Command ${command} sent to the board successfully.`);
};

const updateLEDStatus = async (command, setStatus) => {
  try {
    const response = await fetch('/api/getControlCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus(command !== 'OFF'); // Update the status based on the command
      notifyUser(command); // Notify the user of the successful command
    }
  } catch (error) {
    console.error('Error updating Command:', error);
    alert('Failed to send command to the board.');
  }
};

const fetchLEDStatus = async (setStatus) => {
  try {
    const response = await fetch('/api/getCurrentStatus', {
      method: 'GET',
    });

    const data = await response.json();

    if (data.success) {
      setStatus(data.isOn); // Assume the response has an `isOn` boolean property
    }
  } catch (error) {
    console.error('Error fetching current status:', error);
  }
};

const Navbar = () => {
  const [ledStatus, setLEDStatus] = useState(false);

  useEffect(() => {
    // Fetch the current LED status when the component loads
    fetchLEDStatus(setLEDStatus);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
      <div className="container-fluid d-flex justify-content-center">
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex justify-content-center">
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="./">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="/History">History</Link>
            </li>
            <form className="d-flex align-items-center">
              <button type="button" className={`btn ${styles.btnCustom}`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}>Open System</button>
              <button type="button" className={`btn ${styles.btnCustom}`} onClick={() => updateLEDStatus('HBD_ON', setLEDStatus)}>Music</button>
              <button type="button" className={`btn ${styles.btnDanger}`} onClick={() => updateLEDStatus('OFF', setLEDStatus)}>Off</button>
              <span className={`${ledStatus ? styles.statusOn : styles.statusOff}`}>
                {ledStatus ? 'LED is ON' : 'LED is OFF'}
              </span>
            </form>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;