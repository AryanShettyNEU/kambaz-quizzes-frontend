import {
  Button,
  Col,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { ASSIGNMENT_GROUP, QUIZ_TYPES } from "../../constants";
import { formatToReadable } from "../../utils";
export default function QuizDetailsEditor() {
  return (
    <>
      <FormLabel htmlFor="wd-title">Quiz Title</FormLabel>
      <FormControl id="wd-title" placeholder="Assignment" />

      <FormControl
        className="mt-4"
        as="textarea"
        id="wd-description"
        rows={12}
        cols={42}
      />

      <Row className="my-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-points">Points</FormLabel>
        </Col>
        <Col sm={6}>
          <FormControl id="wd-points" type="number" />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-quiz-type">Quiz Type</FormLabel>
        </Col>
        <Col sm={6}>
          <FormSelect id="wd-quiz-type">
            {QUIZ_TYPES.map((value) => (
              <option value={value}>{formatToReadable(value)}</option>
            ))}
          </FormSelect>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-assignment-group">Assignment Group</FormLabel>
        </Col>
        <Col sm={6}>
          <FormSelect id="wd-assignment-group">
            {ASSIGNMENT_GROUP.map((value) => (
              <option value={value}>{formatToReadable(value)}</option>
            ))}
          </FormSelect>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={3}></Col>
        <Col sm={6}>
          <h6 className="fw-bold">Options</h6>
          <FormCheck
            type="checkbox"
            name="shuffleAnswers"
            label="Shuffle Answers"
            defaultChecked
          />
          <div className="d-flex align-items-center">
            <FormCheck
              type="checkbox"
              name="timeLimitChecked"
              label="Time Limit"
              className="me-4"
            />
            <FormControl
              id="wd-time-limit"
              type="number"
              defaultValue={20}
              style={{
                width: "60px",
              }}
            />
            <div className="ms-2">Minutes</div>
          </div>
          <div className="border p-2 mt-2 rounded">
            <FormCheck
              type="checkbox"
              name="allowMultipleAttempts"
              label="Allow Multiple Attempts"
            />
          </div>
          <div className="my-2">
            <FormLabel htmlFor="wd-access-code">Access Code</FormLabel>

            <FormControl id="wd-access-code" type="input" />
          </div>
          <FormCheck
            type="checkbox"
            name="oneQuestionAtATime"
            label="One Question At a Time"
            defaultChecked
          />
          <FormCheck
            type="checkbox"
            name="webcamRequired"
            label="Webcam Required"
          />
          <FormCheck
            type="checkbox"
            name="lockQuestionsAfterAnswering"
            label="Lock Questions After Answering"
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <p>Assign</p>
        </Col>
        <Col sm={6}>
          <div className="border p-3 rounded">
            <div>
              <FormLabel htmlFor="wd-assign-to" className="fw-bold">
                Assign to
              </FormLabel>
              <br />
              <div>Everyone</div>
            </div>
            <br />
            <div>
              <FormLabel htmlFor="wd-due-date" className="fw-bold">
                Due
              </FormLabel>
              <br />
              <FormControl type="date" id="wd-due-date" />
            </div>
            <br />
            <Row>
              <Col>
                <FormLabel htmlFor="wd-available-from" className="fw-bold">
                  Available from
                </FormLabel>
                <FormControl type="date" id="wd-available-from" />
              </Col>
              <Col>
                <FormLabel htmlFor="wd-available-until" className="fw-bold">
                  Until
                </FormLabel>
                <FormControl type="date" id="wd-available-until" />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <hr />
      <div className="d-flex justify-content-end">
        <Button variant="secondary" id="wd-quiz-edit-cancel">
          Cancel
        </Button>
        <Button id="wd-quiz-edit-save" href=".." className="mx-1">
          Save
        </Button>
        <Button variant="danger" id="wd-quiz-edit-save" href="..">
          Save And Publish
        </Button>
      </div>
    </>
  );
}
