import React, { useState, useEffect } from "react";
import { Grid, Dropdown, Container, Header, Icon } from "semantic-ui-react";
import "./App.css";

import SectionForm from "./components/Forms/SectionForm";
import TunoForm from "./components/Forms/TunoForm";
import SoundForm from "./components/Forms/SoundForm";
import EntityList from "./components/EntityList";

import {
  allSections,
  deleteSection,
  allSounds,
  deleteSound,
  allTunos,
  deleteTuno,
} from "./data/tuistAPI";

const DB_ENTITIES_TEXT = ["Tuno", "Section", "Sound"];
const REFETCH_INTERVAL = 10000; // 10s

// TODO: Protect with password (req to ask for current token and pass it down in requests)

// - IMPLEMENTATION

export default function App() {
  const [entity, setEntity] = useState("section");
  const [sectionList, setSectionList] = useState(null);
  const [tunoList, setTunoList] = useState(null);
  const [soundList, setSoundList] = useState(null);

  function entityConfigs(entity) {
    switch (entity) {
      case "tuno":
        return {
          list: tunoList,
          header: (entity) => entity.id,
          content: (entity) => (
            <div>
              {entity.first_name} "Messi" {entity.last_name}
            </div>
          ),
          deleteAction: { func: deleteTuno, args: (id) => ({ id }) },
        };
      case "section":
        return {
          list: sectionList,
          header: (entity) =>
            ["id", "page_ref", "section_name"]
              .map((key) => entity[key])
              .join("/"),
          content: (entity) => (
            <pre className="JSON">
              {JSON.stringify(JSON.parse(entity.config), null, 2)}
            </pre>
          ),
          deleteAction: { func: deleteSection, args: (id) => ({ id }) },
        };
      case "sound":
        return {
          list: soundList,
          header: (entity) => `${entity.id} - ${entity.sound_name}`,
          content: (entity) => (
            <div>{`URL: ${entity.url_str.substring(0, 50)}...`}</div>
          ),
          deleteAction: { func: deleteSound, args: (id) => ({ id }) },
        };
      default:
        return {};
    }
  }

  function fetchList(entity) {
    switch (entity) {
      case "section":
        allSections().then((sectionsResult) => {
          setSectionList(sectionsResult);
        });
        break;
      case "tuno":
        allTunos().then((tunosResult) => {
          setTunoList(tunosResult);
        });
        break;
      case "sound":
        allSounds().then((soundsResult) => {
          setSoundList(soundsResult);
        });
        break;
      default:
        return;
    }
  }

  useEffect(() => {
    fetchList("tuno");
    fetchList("section");
    fetchList("sound");

    const listRefetcher = setInterval(() => {
      fetchList("tuno");
      fetchList("section");
      fetchList("sound");
    }, REFETCH_INTERVAL);

    return () => {
      clearInterval(listRefetcher);
    };
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <Grid columns={2}>
        <Grid.Column>
          <Header style={{ marginTop: "2rem" }} as="h2" icon textAlign="center">
            <Header.Content>
              <Icon name="plug" circular />
              Tuist Backoffice
            </Header.Content>
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header style={{ marginTop: "2rem" }} as="h2" icon textAlign="center">
            <Header.Content>WIP...</Header.Content>
          </Header>
        </Grid.Column>
      </Grid>

      {/* Management */}
      <Container style={{ marginTop: "2rem" }}>
        <Grid columns={1}>
          <Grid.Column>
            <Dropdown
              options={dropdownOptions(DB_ENTITIES_TEXT)}
              value={entity ? entity : undefined}
              selection
              onChange={(event, obj) => setEntity(obj.value)}
            />
          </Grid.Column>
        </Grid>
        <Grid columns={2} divided>
          <Grid.Column>
            {entity === "tuno" && (
              <TunoForm mode="create" updateFunc={fetchList} />
            )}
            {entity === "sound" && (
              <SoundForm mode="create" updateFunc={fetchList} />
            )}
            {entity === "section" && (
              <SectionForm mode="create" updateFunc={fetchList} />
            )}
          </Grid.Column>
          <Grid.Column>
            <EntityList
              {...entityConfigs(entity)}
              entity={entity}
              updateFunc={fetchList}
            >
              {chooseForm(entity)}
            </EntityList>
          </Grid.Column>
        </Grid>{" "}
      </Container>
    </div>
  );
}

// - INTERNALS

function chooseForm(entity) {
  switch (entity) {
    case "tuno":
      return (props) => <TunoForm {...props} />;
    case "section":
      return (props) => <SectionForm {...props} />;
    case "sound":
      return (props) => <SoundForm {...props} />;
    default:
      return;
  }
}

function dropdownOptions(DB_ENTITIES_TEXT) {
  return DB_ENTITIES_TEXT.map((entity, i) => ({
    key: i,
    text: entity,
    value: entity.toLowerCase(),
  }));
}
