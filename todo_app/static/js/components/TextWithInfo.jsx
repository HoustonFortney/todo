import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import React from 'react';

const TextWithInfo = (props) => {
  const { title, text, children } = props;

  const InfoTooltip = (innerProps) => (
    <Popover id="info-tooltip" {...innerProps}>
      <Popover.Title>{title}</Popover.Title>
      <Popover.Content>
        {children}
      </Popover.Content>
    </Popover>
  );

  const infoButtonStyle = {
    color: 'inherit',
    margin: 'inherit',
    padding: 'inherit',
    paddingBottom: 2,
  };

  return (
    <span>
      {text}
      <>&nbsp;</>
      <OverlayTrigger trigger="click" placement="right" overlay={InfoTooltip}>
        <Button tabIndex={0} style={infoButtonStyle} variant="link">
          <i className="fas fa-info-circle" />
        </Button>
      </OverlayTrigger>
    </span>
  );
};

export default TextWithInfo;
