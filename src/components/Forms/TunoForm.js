import React, { useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import ConfirmDialog from "../ConfirmDialog";
import { createTuno, updateTuno } from "../../data/tuistAPI";

/* 
  mode: "update", "create" (or defined by default with object)
  action: {func, args} submit action from parent
  object: the object we are editing
  updateFunc: (function to update the list after a change)
*/
export default function TunoForm(props) {
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const [toggleWarning, setToggleWarning] = useState({
    status: false,
    message: "Something went wrong!",
  });
  const [selected, setSelected] = useState(
    props.object || {
      first_name: "",
      last_name: "",
    }
  );

  return (
    <div>
      <Form>
        <Form.Field>
          <label>First Name</label>
          <input
            value={selected.first_name}
            placeholder="Ex: 'Gervásio'"
            onChange={(event) => {
              setSelected({ ...selected, first_name: event.target.value });
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input
            value={selected.last_name}
            placeholder="Ex: 'Palha'"
            onChange={(event) => {
              setSelected({ ...selected, last_name: event.target.value });
            }}
          />
        </Form.Field>

        <Button.Group>
          <Button
            positive
            type="submit"
            onClick={async (event) => {
              if (!validateForm(selected)) {
                setToggleWarning({
                  status: true,
                  message: "Cannot submit incorrect form!",
                });
                return;
              }
              if (props.mode === "create") {
                await createTuno({ newObj: selected });
                props.updateFunc("tuno");
              }
              if (props.mode === "update") {
                setToggleConfirm(true);
              }
            }}
          >
            Submit
          </Button>
        </Button.Group>
      </Form>

      {/* Warning */}
      {toggleWarning.status && (
        <Message onDismiss={() => setToggleWarning({ status: false })} negative>
          <Message.Header>{toggleWarning.message}</Message.Header>
        </Message>
      )}

      {/* Confirm Dialog */}
      {selected.id && (
        <ConfirmDialog
          props={{
            open: toggleConfirm,
            setOpen: setToggleConfirm,
            action: {
              func: async () => {
                await updateTuno({ id: selected.id, updatedObj: selected });
                props.updateFunc("tuno");
                props.action.func(props.action.args);
              },
              args: selected.id,
            },
            mode: "UPDATE",
          }}
        />
      )}
    </div>
  );
}

// INTERNALS

function validateForm(formValues) {
  if (!formValues) {
    return false;
  }

  return true;
}
