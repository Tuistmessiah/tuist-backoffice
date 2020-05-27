import React, { useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import ConfirmDialog from "../ConfirmDialog";
import { createSection, updateSection } from "../../data/tuistAPI";

/* 
  mode: "update", "create" (or defined by default with object)
  action: {func, args} submit action from parent
  object: the object we are editing
  updateFunc: (function to update the list after a change)
*/
export default function SectionForm(props) {
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const [toggleWarning, setToggleWarning] = useState({
    status: false,
    message: "Something went wrong!",
  });
  const [selected, setSelected] = useState(
    props.object || {
      section_name: "",
      page_ref: "",
      config: "",
    }
  );

  return (
    <div>
      <Form>
        <Form.Field>
          <label>Section Name</label>
          <input
            value={selected.section_name}
            placeholder="Ex: 'hero' for 'HeroSection'"
            onChange={(event) => {
              setSelected({ ...selected, section_name: event.target.value });
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Page Reference</label>
          <input
            value={selected.page_ref}
            placeholder="Ex: 'homepage' for 'Homepage'"
            onChange={(event) => {
              setSelected({ ...selected, page_ref: event.target.value });
            }}
          />
        </Form.Field>
        <Form.Field>
          <Form.TextArea
            label="Configuration JSON"
            rows="15"
            value={selected.config}
            placeholder={`Ex: ${JSON.stringify(JSONExample, null, 2)}`}
            onChange={(event) => {
              const value = event.target.value;
              try {
                JSON.parse(value);
                setSelected({
                  ...selected,
                  config: JSON.stringify(JSON.parse(value), null, 2),
                });
              } catch (error) {
                setSelected({ ...selected, config: event.target.value });
              }
            }}
          />
        </Form.Field>
        <Button.Group>
          <Button
            positive
            type="submit"
            onClick={async (event) => {
              if (!validateSection(selected)) {
                setToggleWarning({
                  status: true,
                  message: "Cannot submit incorrect form!",
                });
                return;
              }
              if (props.mode === "create") {
                await createSection({ newObj: selected });
                props.updateFunc("section");
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
                await updateSection({ id: selected.id, updatedObj: selected });
                props.updateFunc("section");
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

function validateSection(section) {
  if (!section) {
    return false;
  }

  if (!isJSON(section.config)) {
    return false;
  }

  return true;
}

function isJSON(JSONObj) {
  try {
    JSON.parse(JSONObj);
    return true;
  } catch (error) {
    return false;
  }
}

const JSONExample = {
  image: "https://imgur.com/hLJtcb7",
  title: "Vem conhecer-nos",
  cta: {
    label: "Para a musica",
    slug: "#",
  },
};
