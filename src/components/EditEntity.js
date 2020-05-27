import React from "react";
import { Modal, Button } from "semantic-ui-react";

/* 
  config: {
    open: toggle this modal
    entity: name of entity we are managing
    setOpen: toggler for this modal
  }
  children: component projection (form)
*/
export default function EditEntity({ config, children }) {
  return (
    <div>
      <Modal open={config.open}>
        <Modal.Header>Update {config.entity}</Modal.Header>
        <Modal.Content>
          <Modal.Description>{children}</Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={() => config.setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
