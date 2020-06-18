import { useContext } from 'react';
import { ModalVisibilityContext } from './edit_modal_visibility_context';

export const useModalVisibility = () => useContext(ModalVisibilityContext);
