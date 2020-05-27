import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

// props: open, setOpen, action (func, args), mode
export default function ConfirmDialog({ props }) {
  return (
    <Modal open={props.open} basic size="small" centered>
      <Header icon="archive" content="Are you sure?" />
      <Modal.Content>
        {props.mode === "DELETE" && (
          <p>This will delete an entity from the database.</p>
        )}
        {props.mode === "UPDATE" && (
          <p>This will change an entity from the database.</p>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={() => props.setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => {
            props.action.func(props.action.args);
            props.setOpen(false);
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
