import React, { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import './HelpTooltip.css';

function HelpTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div className="help-tooltip">
      <FaQuestionCircle
        className="help-icon"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="tooltip-content">
          <b>Sublytic Quick Help</b>
          <ul>
            <li>Dashboard: Manage subscriptions & forecast expenses</li>
            <li>Insights: Analyze spending & value scores</li>
            <li>Notifications: Get renewal alerts</li>
            <li>What-if: Simulate changes to your subscriptions</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default HelpTooltip;
