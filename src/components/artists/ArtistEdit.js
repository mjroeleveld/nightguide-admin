import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

function ArtistEdit(props) {
  return (
    <Edit undoable={false} {...props}>
      <SimpleForm redirect="edit">
        <TextInput source="name" />
      </SimpleForm>
    </Edit>
  );
}

export default ArtistEdit;
