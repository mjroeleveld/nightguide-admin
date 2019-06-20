import {
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  DELETE,
  GET_MANY,
  GET_MANY_REFERENCE,
} from 'react-admin';
import _ from 'lodash';

import request from './request';

export default async (type, params) => {
  switch (type) {
    case GET_LIST: {
      return getList(params);
    }
    case GET_ONE: {
      const { id, query = {} } = params;
      query.populate = ['images'];
      return request(`/events/${id}`, { query });
    }
    case GET_MANY: {
      const { ids } = params;
      return request(`/events`, { query: { ids: ids.join(',') || undefined } });
    }
    case UPDATE: {
      const { id, data, previousData } = params;
      const { images, ...body } = data;

      const deletedImages = previousData.images
        .map(img => img.id)
        .filter(imgId => !_.find(images, { id: imgId }));
      const newImages = images.map(img => img.rawFile).filter(img => !!img);
      await updateImages(id, newImages, deletedImages);

      return request(`/events/${id}`, { body, method: 'PUT' });
    }
    case DELETE: {
      const { id } = params;
      return request(`/events/${id}`, { method: 'DELETE', id });
    }
    case GET_MANY_REFERENCE:
      if (params.target === 'venue') {
        params.filter.venue = params.id;
      }
      return getList(params);
  }
};

function getList(opts) {
  const { pagination, filter = {} } = opts;
  if (filter.dateFrom) {
    filter.dateFrom = new Date(filter.dateFrom).toISOString();
  }
  if (filter.organiser) {
    filter.venue = filter.organiser.venue;
    delete filter.organiser;
  }
  return request('/events', {
    pagination,
    fields: ['facebook', 'title', 'images', 'dates', 'organiser'],
    query: { ...filter },
  });
}

async function updateImages(eventId, toCreate = [], toDelete = []) {
  if (toCreate.length) {
    const createBody = new FormData();
    toCreate.forEach(file => createBody.append('images', file));
    await request(`/events/${eventId}/images`, {
      method: 'POST',
      body: createBody,
      json: false,
    });
  }
  if (toDelete.length) {
    for (const imgId of toDelete) {
      await request(`/events/${eventId}/images/${imgId}`, {
        method: 'DELETE',
      });
    }
  }
}