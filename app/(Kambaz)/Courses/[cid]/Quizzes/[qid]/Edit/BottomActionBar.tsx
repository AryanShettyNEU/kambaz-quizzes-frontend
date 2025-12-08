import React from "react";
import { Button } from "react-bootstrap";

const BottomActionBar = ({
  handleCancel,
  handleSave,
  handleSaveAndPublish,
}: {
  handleCancel: () => void;
  handleSave: () => void;
  handleSaveAndPublish: () => void;
}) => {
  return (
    <div className="d-flex justify-content-end gap-2">
      <Button variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
      <Button variant="danger" onClick={handleSaveAndPublish}>
        Save And Publish
      </Button>
    </div>
  );
};

export default BottomActionBar;
