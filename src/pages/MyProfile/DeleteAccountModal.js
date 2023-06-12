import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal } from 'reactstrap';

import { deleteUserProfile } from 'store/user.slice';

export const DeleteAccountModal = ({
  user,
  isDeleteModalVisible,
  setIsDeleteModalVisible,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const deleteAccount = () => {
    dispatch(deleteUserProfile(user?.id));
    setIsDeleteModalVisible(false);
  };

  return (
    <Modal
      isOpen={isDeleteModalVisible}
      toggle={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
      scrollable={true}
      id="staticBackdrop"
    >
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">
          {t('Warning', { ns: 'common' })}!
        </h5>

        <button
          type="button"
          className="btn-close"
          onClick={() => setIsDeleteModalVisible(false)}
          aria-label="Close"
        ></button>
      </div>

      <div className="modal-body">
        <p>{t('confirm-delete-text', { ns: 'myprofile' })}.</p>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-light"
          onClick={() => setIsDeleteModalVisible(false)}
        >
          {t('Close', { ns: 'common' })}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => deleteAccount()}
        >
          {t('Yes', { ns: 'common' })}
        </button>
      </div>
    </Modal>
  );
};
