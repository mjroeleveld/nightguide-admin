import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Filter,
  TextInput,
  BooleanInput,
  FormDataConsumer,
} from 'react-admin';

import PageSlugFilterUpdater from '../PageSlugFilterUpdater';

const VenueFilter = props => (
  <Filter {...props}>
    <FormDataConsumer alwaysOn>
      {() => <PageSlugFilterUpdater />}
    </FormDataConsumer>
    <TextInput label="Search" source="query" alwaysOn />
    <BooleanInput label="Show hidden" source="showHidden" />
    <TextInput label="Page slug" source="pageSlug" alwaysOn />
  </Filter>
);

function VenueList(props) {
  return (
    <List {...props} filters={<VenueFilter />}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
      </Datagrid>
    </List>
  );
}

export default VenueList;
