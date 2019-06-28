import React from 'react';
import { Admin, Resource } from 'react-admin';

import dataProvider from './services/api';
import authProvider from './services/api/auth';

import VenueList from './components/VenueList';
import VenueEdit from './components/VenueEdit';
import VenueShow from './components/VenueShow';
import TagList from './components/TagList';
import TagEdit from './components/TagEdit';
import TagCreate from './components/TagCreate';
import EventList from './components/EventList';
import EventShow from './components/EventShow';
import EventEdit from './components/EventEdit';
import AppLayout from './components/AppLayout';

import citiesReducer from './state/cities';

function App() {
  const customReducers = {
    cities: citiesReducer,
  };

  return (
    <Admin
      appLayout={AppLayout}
      dataProvider={dataProvider}
      authProvider={authProvider}
      customReducers={customReducers}
    >
      <Resource
        name="events"
        show={EventShow}
        list={EventList}
        edit={EventEdit}
      />
      <Resource
        name="venues"
        list={VenueList}
        edit={VenueEdit}
        show={VenueShow}
      />
      <Resource name="tags" list={TagList} edit={TagEdit} create={TagCreate} />
    </Admin>
  );
}

export default App;
