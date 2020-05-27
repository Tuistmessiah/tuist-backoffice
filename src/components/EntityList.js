import React, { useState } from "react";
import { List, Button, Icon } from "semantic-ui-react";
import ConfirmDialog from "./ConfirmDialog";
import EditEntity from "./EditEntity";

/* 
  entity: name (used to call the list 'updateFunc' function in the parent)
  list: of items to be presented (list of items to be rendered)
  header: array of items to be rendered in header (custom function to render the header of each cell)
  content: node to be rendered in content (custom function to render the content of each cell)
  deleteAction: { func, args: {} } (the function and arguments that will be triggered when deleting)
  editAction: { func, args: {} } (the function and arguments that will be triggered when updating)
  updateFunc: (function to update the list after a change)
  children: component projection (form)
*/
export default function EntityList(props) {
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [id, setId] = useState(null);

  if (!props.list) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <List divided relaxed verticalAlign="middle">
        {props.list.map((entity, i) => (
          <List.Item key={i}>
            <List.Header>{props.header(entity)}</List.Header>
            <List.Content floated="right">
              <Button
                basic
                color="red"
                onClick={() => {
                  setId(entity.id);
                  setToggleConfirm(true);
                }}
              >
                <Icon name="remove" /> Delete
              </Button>
              <Button
                color="blue"
                onClick={() => {
                  setId(entity.id);
                  setToggleEdit(true);
                }}
              >
                <Icon name="cog" /> Edit
              </Button>
            </List.Content>
            <List.Content>
              <List.Description>{props.content(entity)}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>

      {/* Confirm Dialog */}
      {id && (
        <ConfirmDialog
          props={{
            open: toggleConfirm,
            setOpen: setToggleConfirm,
            action: {
              func: async (args) => {
                await props.deleteAction.func(args);
                props.updateFunc(props.entity);
              },
              args: props.deleteAction.args(id),
            },
            mode: "DELETE",
          }}
        />
      )}

      {/* Edit Dialog */}
      {id && (
        <EditEntity
          config={{
            open: toggleEdit,
            setOpen: setToggleEdit,
            entity: props.entity,
          }}
        >
          {props.children({
            mode: "update",
            object: props.list.find((entity) => entity.id === id),
            updateFunc: props.updateFunc,
            action: { func: setToggleEdit, args: false },
          })}
        </EditEntity>
      )}
    </div>
  );
}
