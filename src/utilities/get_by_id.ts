import { queryByAttribute } from '@testing-library/react';
/**
 * Allows querying for an element by its id in enzyme tests
 */
export const getById = queryByAttribute.bind(null, 'id');