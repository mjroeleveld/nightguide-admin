import React from 'react';
import {
  EditController,
  EditView,
  ReferenceArrayInput,
  TextInput,
  SelectArrayInput,
  ImageInput,
  TabbedForm,
  BooleanInput,
  FormTab,
  NumberInput,
  ArrayInput,
  DateTimeInput,
  required,
  SelectInput,
  AutocompleteArrayInput,
  regex,
  SimpleFormIterator,
  ShowButton,
  CloneButton,
  TopToolbar,
  FormDataConsumer,
  ReferenceInput,
  AutocompleteInput,
} from 'react-admin';
import { connect } from 'react-redux';

import GoogleImage from '../GoogleImage';
import { __src } from '../../services/i18n';
import TranslatedTextInput from '../TranslatedTextInput';
import FormAccordion from '../FormAccordion';
import EventDates from './EventDates';
import EventTicketProviderFields from './EventTicketProviderFields';
import { getPageSlugs } from '../../state/cities';
import EventDateRepeater from './EventDateRepeater';

const EventEditActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <ShowButton basePath={basePath} record={data} />
    <CloneButton basePath={basePath} record={data} />
  </TopToolbar>
);

function EventEdit(props) {
  const { pageSlug, pageSlugs, dispatch, ...otherProps } = props;

  return (
    <EditController undoable={false} {...otherProps}>
      {controllerProps => {
        const { record } = controllerProps;
        const isFbEvent = record && record.facebook && record.facebook.id;
        return (
          <EditView
            {...otherProps}
            {...controllerProps}
            actions={<EventEditActions />}
          >
            <TabbedForm redirect="edit">
              <FormTab label="General">
                <SelectInput
                  validate={required()}
                  source="pageSlug"
                  choices={pageSlugs.map(slug => ({
                    id: slug,
                    name: slug,
                  }))}
                />
                <TextInput source="title" />
                <TranslatedTextInput source="description" rich={true} />
                <ReferenceArrayInput
                  label="Tags"
                  reference="tags"
                  source="tags"
                >
                  <SelectArrayInput optionText={__src('name')} />
                </ReferenceArrayInput>
                <ReferenceArrayInput
                  label="Artists (all dates)"
                  source="artists"
                  reference="artists"
                >
                  <AutocompleteArrayInput optionText="name" />
                </ReferenceArrayInput>
                <BooleanInput source="admin.hide" label="Hide" />
              </FormTab>
              <FormTab label="Dates">
                <EventDateRepeater />
                <BooleanInput
                  source="facebook.datesChanged"
                  label="Dates changed"
                />
                <ArrayInput
                  validate={required()}
                  source="dates"
                  style={{ width: '100%' }}
                >
                  <FormAccordion
                    LabelComponent={({ record }) => (
                      <EventDates record={{ dates: record }} source="dates" />
                    )}
                    disableAdd={() => isFbEvent}
                  >
                    <DateTimeInput
                      source="from"
                      disabled={isFbEvent}
                      validate={required()}
                    />
                    <DateTimeInput
                      source="to"
                      disabled={isFbEvent}
                      parse={v => (v ? v : undefined)}
                    />
                    <ReferenceArrayInput
                      label="Artists"
                      source="artists"
                      reference="artists"
                    >
                      <AutocompleteArrayInput optionText="name" />
                    </ReferenceArrayInput>
                    <TextInput
                      label="Ticket redirect URL"
                      source="ticketsUrl"
                      type="url"
                      validate={regex(/^https?:\/\/.+\..+/, 'Not a valid URL')}
                    />
                    <TextInput
                      label="Provider event ID"
                      source="providerEventId"
                    />
                    <NumberInput
                      source={'interestedCount'}
                      label={'Interested count'}
                    />
                    <BooleanInput source="isHot" label="Is hot" />
                  </FormAccordion>
                </ArrayInput>
              </FormTab>
              <FormTab label="Location">
                <TextInput
                  source="location.type"
                  defaultValue="venue"
                  disabled={true}
                />
                <ReferenceInput
                  validate={required()}
                  label="Venue"
                  source="organiser.venue"
                  reference="venues"
                >
                  <AutocompleteInput disabled={true} optionText="name" />
                </ReferenceInput>
              </FormTab>
              <FormTab label="Tickets">
                <ArrayInput source="tickets.products" label="Products">
                  <SimpleFormIterator>
                    <TextInput label="Name" source="name" />
                    <NumberInput label="Price" source="price" />
                  </SimpleFormIterator>
                </ArrayInput>
                <NumberInput
                  source="tickets.displayPrice"
                  label="Display price"
                />
                <TextInput
                  label="Ticket redirect URL"
                  source="tickets.checkoutUrl"
                  type="url"
                  validate={regex(/^https?:\/\/.+\..+/, 'Not a valid URL')}
                />
                <EventTicketProviderFields />
                <BooleanInput source="tickets.soldOut" label="Sold out" />
                <BooleanInput source="tickets.doorSale" label="Door sale" />
                <BooleanInput source="tickets.free" label="Free" />
                <FormDataConsumer>
                  {({ formData }) => {
                    const { tickets = {} } = formData || {};
                    return (
                      <React.Fragment>
                        <BooleanInput source="tickets.qrCode" label="QR code" />
                        {tickets.qrCode && (
                          <TranslatedTextInput
                            validate={required()}
                            source="tickets.qrCodeInfo"
                            label="QR code info"
                            rich={true}
                            inputProps={{ minEditorHeight: 60, commands: [] }}
                          />
                        )}
                        <BooleanInput
                          source="tickets.guestList"
                          label="Guest list"
                        />
                        {tickets.guestList && (
                          <TranslatedTextInput
                            validate={required()}
                            source="tickets.guestListInfo"
                            label="Guest list info"
                            rich={true}
                            inputProps={{ minEditorHeight: 60, commands: [] }}
                          />
                        )}
                      </React.Fragment>
                    );
                  }}
                </FormDataConsumer>
              </FormTab>
              <FormTab label="Media">
                <ImageInput
                  source="images"
                  accept="image/*"
                  maxSize={5000000} // 5MB
                  multiple
                >
                  <GoogleImage showIdField={true} source="url" size={230} />
                </ImageInput>
                <TextInput
                  label="Video URL"
                  source="videoUrl"
                  validate={regex(/^https?:\/\/.+\..+/, 'Not a valid URL')}
                  type="url"
                />
              </FormTab>
            </TabbedForm>
          </EditView>
        );
      }}
    </EditController>
  );
}

export default connect(state => ({
  pageSlug: state.cities.pageSlug,
  pageSlugs: getPageSlugs(state),
}))(EventEdit);
