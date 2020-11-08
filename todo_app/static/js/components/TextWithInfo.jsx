import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import React from "react";

const TextWithInfo = (props) => {
    const InfoTooltip = (props) =>
        <Popover id="markdown-tooltip" {...props}>
            <Popover.Title>{props.title}</Popover.Title>
            <Popover.Content>
                Supports <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">markdown</a>.
                {props.children}
            </Popover.Content>
        </Popover>

    return (
        <OverlayTrigger trigger="focus" placement="right" overlay={InfoTooltip}>
            <span>
                {props.text}&nbsp;
                <Button
                    style={{color: "inherit", margin: "inherit", padding: "inherit", paddingBottom: 2}}
                    variant="link">
                    <i className="fas fa-info-circle"/>
                </Button>
            </span>
        </OverlayTrigger>
    );
}

export default TextWithInfo;
