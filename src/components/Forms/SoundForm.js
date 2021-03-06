import React, { useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import ConfirmDialog from "../ConfirmDialog";
import { createSound, updateSound } from "../../data/tuistAPI";

/* 
  mode: "update", "create" (or defined by default with object)
  action: {func, args} submit action from parent
  object: the object we are editing
  updateFunc: (function to update the list after a change)
*/
export default function SoundForm(props) {
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const [toggleWarning, setToggleWarning] = useState({
    status: false,
    message: "Something went wrong!",
  });
  const [selected, setSelected] = useState(
    props.object || {
      sound_name: "",
      url_str: "",
    }
  );

  return (
    <div>
      <Form>
        <Form.Field>
          <label>Sound Name</label>
          <input
            value={selected.sound_name}
            placeholder="Ex: 'NL XV - Noites de Luar'"
            onChange={(event) => {
              setSelected({ ...selected, sound_name: event.target.value });
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>URL Link</label>
          <input
            value={selected.url_str}
            placeholder="Ex: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/...'"
            onChange={(event) => {
              setSelected({ ...selected, url_str: event.target.value });
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
                await createSound({ newObj: selected });
                props.updateFunc("sound");
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
                await updateSound({ id: selected.id, updatedObj: selected });
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
