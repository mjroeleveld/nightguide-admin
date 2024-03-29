import React from 'react';
import {
  Edit,
  TabbedForm,
  FormTab,
  ArrayInput,
  ReferenceInput,
  AutocompleteInput,
  SelectInput,
  required,
  TextInput,
  ReferenceField,
  TextField,
  SimpleShowLayout,
  ImageInput,
} from 'react-admin';
import { connect } from 'react-redux';

import TranslatedTextInput from '../TranslatedTextInput';
import { getPageSlugs } from '../../state/cities';
import FormAccordion from '../FormAccordion';
import GoogleImage from '../GoogleImage';
import ImageSelector from '../ImageSelector';

const VenueLabel = connect()(props =>
  props.record.venueId ? (
    <SimpleShowLayout
      {...props}
      basePath="/venues-articles"
      resource="venues-articles"
    >
      <ReferenceField
        source="venueId"
        reference="venues"
        resource="venues-articles"
        link={false}
        addLabel={false}
      >
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  ) : (
    'NEW'
  )
);

function VenuesArticleEdit(props) {
  const { pageSlug, pageSlugs, ...otherProps } = props;

  return (
    <Edit undoable={false} {...otherProps}>
      <TabbedForm redirect="edit">
        <FormTab label="General">
          <TextInput source="urlSlugs.0" label="URL slug" />
          <SelectInput
            validate={required()}
            source="pageSlug"
            defaultValue={pageSlug}
            choices={pageSlugs.map(slug => ({
              id: slug,
              name: slug,
            }))}
          />
          <TranslatedTextInput
            validate={required()}
            source="title"
            label="Title"
          />
          <TranslatedTextInput
            validate={required()}
            source="intro"
            label="Intro text"
            rich={true}
            inputProps={{ minEditorHeight: 60, commands: [] }}
          />
          <TranslatedTextInput
            validate={required()}
            source="footer"
            label="Footer text"
            rich={true}
            inputProps={{ minEditorHeight: 60, commands: [] }}
          />
        </FormTab>
        <FormTab label="Venues">
          <ArrayInput
            validate={required()}
            source="venues"
            style={{ width: '100%' }}
          >
            <FormAccordion LabelComponent={VenueLabel}>
              <ReferenceInput
                validate={required()}
                label="Venue"
                source="venueId"
                reference="venues"
                filter={{ pageSlug }}
              >
                <AutocompleteInput optionText="name" />
              </ReferenceInput>
              <TranslatedTextInput
                validate={required()}
                source="tagLine"
                label="Tag line"
              />
              <TranslatedTextInput
                validate={required()}
                source="body"
                label="Body"
                rich={true}
              />
            </FormAccordion>
          </ArrayInput>
        </FormTab>
        <FormTab label="Media">
          <ImageSelector source="coverImage" imagesSource="images" />
          <ImageInput
            source="images"
            accept="image/*"
            maxSize={5000000} // 5MB
            multiple
          >
            <GoogleImage source="url" size={230} />
          </ImageInput>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
}

export default connect(state => ({
  pageSlug: state.cities.pageSlug,
  pageSlugs: getPageSlugs(state),
}))(VenuesArticleEdit);
