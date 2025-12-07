// "use client";
// import React, { useState } from "react";
// import { Button, Form, Card, Col, Row, InputGroup } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "next/navigation";
// import { addQuestion, updateQuestion, deleteQuestion } from "../../reducer"; // Path based on your structure
// import { FaTrash } from "react-icons/fa";

// export default function QuizQuestionsEditor() {
//   const { questions } = useSelector((state: any) => state.quizzesReducer);
//   const dispatch = useDispatch();
//   const { qid } = useParams();

//   // State to track which question is currently being edited (null = none)
//   const [editingId, setEditingId] = useState<string | null>(null);
  
//   // Local state for the question form being edited
//   const [tempQuestion, setTempQuestion] = useState<any>({});

//   const handleNewQuestion = () => {
//     const newId = new Date().getTime().toString();
//     const newQuestion = {
//       _id: newId,
//       title: "New Question",
//       points: 10,
//       type: "MULTIPLE_CHOICE", // Rubric: Multiple choice is default
//       question: "Enter your question text here",
//       choices: ["Choice 1", "Choice 2", "Choice 3"],
//       correctAnswers: ["Choice 1"], // Default correct answer
//     };
//     dispatch(addQuestion(newQuestion));
//     setEditingId(newId); // Rubric: New questions displayed in edit mode
//     setTempQuestion(newQuestion);
//   };

//   const handleEditClick = (q: any) => {
//     setEditingId(q._id);
//     setTempQuestion({ ...q }); // Deep copy to avoid mutating Redux directly
//   };

//   const handleSave = () => {
//     dispatch(updateQuestion(tempQuestion));
//     setEditingId(null);
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//   };

//   // --- Helper to handle choices for Multiple Choice ---
//   const handleChoiceChange = (index: number, value: string) => {
//     const newChoices = [...tempQuestion.choices];
//     newChoices[index] = value;
//     setTempQuestion({ ...tempQuestion, choices: newChoices });
//   };

//   const addChoice = () => {
//     setTempQuestion({
//       ...tempQuestion,
//       choices: [...tempQuestion.choices, "New Choice"],
//     });
//   };

//   const deleteChoice = (index: number) => {
//     const newChoices = tempQuestion.choices.filter((_: any, i: number) => i !== index);
//     setTempQuestion({ ...tempQuestion, choices: newChoices });
//   };

//   return (
//     <div className="p-3">
//       <div className="text-center mb-4">
//         <Button variant="secondary" onClick={handleNewQuestion}>
//           + New Question
//         </Button>
//       </div>

//       {questions.map((q: any) => (
//         <Card key={q._id} className="mb-4 shadow-sm">
//           {editingId === q._id ? (
//             // ================== EDIT MODE ==================
//             <Card.Body>
//               <div className="d-flex justify-content-between mb-3">
//                 <Form.Group className="d-flex align-items-center gap-2">
//                   <Form.Control
//                     value={tempQuestion.title}
//                     onChange={(e) => setTempQuestion({ ...tempQuestion, title: e.target.value })}
//                     placeholder="Question Title"
//                     style={{ width: "200px" }}
//                   />
//                   <Form.Select
//                     value={tempQuestion.type}
//                     onChange={(e) => setTempQuestion({ ...tempQuestion, type: e.target.value })}
//                     style={{ width: "200px" }}
//                   >
//                     <option value="MULTIPLE_CHOICE">Multiple Choice</option>
//                     <option value="TRUE_FALSE">True/False</option>
//                     <option value="FILL_BLANKS">Fill in the Blank</option>
//                   </Form.Select>
//                 </Form.Group>
//                 <div className="d-flex align-items-center gap-2">
//                   <span>pts:</span>
//                   <Form.Control
//                     type="number"
//                     value={tempQuestion.points}
//                     onChange={(e) => setTempQuestion({ ...tempQuestion, points: parseInt(e.target.value) })}
//                     style={{ width: "70px" }}
//                   />
//                 </div>
//               </div>

//               <hr />

//               <Form.Group className="mb-3">
//                 <Form.Label>Question Text</Form.Label>
//                 {/* Rubric says WYSIWYG, textarea is the standard fallback for this assignment level */}
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={tempQuestion.question}
//                   onChange={(e) => setTempQuestion({ ...tempQuestion, question: e.target.value })}
//                 />
//               </Form.Group>

//               {/* === Question Type Specific Logic === */}
              
//               {/* 1. Multiple Choice Editor */}
//               {tempQuestion.type === "MULTIPLE_CHOICE" && (
//                 <div>
//                   <h6>Answers</h6>
//                   {tempQuestion.choices?.map((choice: string, idx: number) => (
//                     <InputGroup className="mb-2" key={idx}>
//                       <InputGroup.Text>
//                         <Form.Check
//                           type="radio"
//                           name="correctAnswer"
//                           checked={tempQuestion.correctAnswers.includes(choice)}
//                           onChange={() => setTempQuestion({ ...tempQuestion, correctAnswers: [choice] })}
//                         />
//                       </InputGroup.Text>
//                       <Form.Control
//                         value={choice}
//                         onChange={(e) => handleChoiceChange(idx, e.target.value)}
//                       />
//                       <Button variant="outline-danger" onClick={() => deleteChoice(idx)}>
//                         <FaTrash />
//                       </Button>
//                     </InputGroup>
//                   ))}
//                   <div className="text-end">
//                     <Button variant="link text-danger" onClick={addChoice}>
//                       + Add Another Answer
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* 2. True/False Editor */}
//               {tempQuestion.type === "TRUE_FALSE" && (
//                 <div>
//                   <h6>Correct Answer</h6>
//                   <Form.Check
//                     type="radio"
//                     label="True"
//                     name="tfAnswer"
//                     checked={tempQuestion.correctAnswers.includes("True")}
//                     onChange={() => setTempQuestion({ ...tempQuestion, correctAnswers: ["True"] })}
//                     className="mb-2"
//                   />
//                   <Form.Check
//                     type="radio"
//                     label="False"
//                     name="tfAnswer"
//                     checked={tempQuestion.correctAnswers.includes("False")}
//                     onChange={() => setTempQuestion({ ...tempQuestion, correctAnswers: ["False"] })}
//                   />
//                 </div>
//               )}

//               {/* 3. Fill in the Blank Editor */}
//               {tempQuestion.type === "FILL_BLANKS" && (
//                 <div>
//                   <h6>Possible Answers (Case Insensitive)</h6>
//                   {tempQuestion.correctAnswers?.map((ans: string, idx: number) => (
//                     <div key={idx} className="d-flex mb-2 align-items-center gap-2">
//                        <Form.Control
//                         value={ans}
//                         onChange={(e) => {
//                             const newAns = [...tempQuestion.correctAnswers];
//                             newAns[idx] = e.target.value;
//                             setTempQuestion({...tempQuestion, correctAnswers: newAns});
//                         }}
//                        />
//                        <Button variant="outline-danger" size="sm" onClick={() => {
//                             const newAns = tempQuestion.correctAnswers.filter((_:any, i:number) => i !== idx);
//                             setTempQuestion({...tempQuestion, correctAnswers: newAns});
//                        }}>
//                         <FaTrash />
//                        </Button>
//                     </div>
//                   ))}
//                   <Button variant="link" onClick={() => setTempQuestion({...tempQuestion, correctAnswers: [...tempQuestion.correctAnswers, ""]})}>
//                     + Add Correct Answer
//                   </Button>
//                 </div>
//               )}

//               <div className="mt-4 d-flex gap-2">
//                 <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
//                 <Button variant="danger" onClick={handleSave}>Update Question</Button>
//               </div>
//             </Card.Body>
//           ) : (
//             // ================== PREVIEW MODE ==================
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <h5>{q.title}</h5>
//                   <div className="text-muted mb-2">{q.type.replace("_", " ")}</div>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <span className="fw-bold">{q.points} pts</span>
//                   <Button variant="secondary" size="sm" onClick={() => handleEditClick(q)}>
//                     Edit
//                   </Button>
//                   <Button variant="danger" size="sm" onClick={() => dispatch(deleteQuestion(q._id))}>
//                     <FaTrash />
//                   </Button>
//                 </div>
//               </div>
//               <hr />
//               <p>{q.question}</p>
              
//               {/* Simple Preview of Answers */}
//               <div className="ms-3 fst-italic text-muted">
//                 {q.type === "MULTIPLE_CHOICE" && (
//                     <ul>
//                         {q.choices.map((c:string, i:number) => (
//                             <li key={i} className={q.correctAnswers.includes(c) ? "text-success fw-bold" : ""}>{c}</li>
//                         ))}
//                     </ul>
//                 )}
//                 {q.type === "TRUE_FALSE" && <p>Answer: {q.correctAnswers[0]}</p>}
//                 {q.type === "FILL_BLANKS" && <p>Answers: {q.correctAnswers.join(", ")}</p>}
//               </div>
//             </Card.Body>
//           )}
//         </Card>
//       ))}
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { Button, Form, Card, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { addQuestion, updateQuestion, deleteQuestion, setQuestions, fetchQuizDetails } from "../../reducer"; 
import { FaTrash } from "react-icons/fa";

export default function QuizQuestionsEditor() {
  const { questions, quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch<any>();
  const { qid } = useParams();

  // FIX: On load, if questions are empty but we have the quiz, load them into state
  React.useEffect(() => {
      const quiz = quizzes.find((q:any) => q._id === qid);
      if (quiz && quiz.questions) {
          dispatch(setQuestions(quiz.questions)); 
      }
  }, [qid, quizzes, dispatch]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempQuestion, setTempQuestion] = useState<any>({});

  // 1. NEW QUESTION (Initialize UI State)
  const handleNewQuestion = () => {
    const newId = new Date().getTime().toString();
    const newUIQuestion = {
      _id: newId,
      title: "New Question",
      points: 10,
      type: "MCQ", 
      question: "Enter your question text",
      choices: ["Choice A", "Choice B"], 
      correctAnswers: ["Choice A"]       
    };
    setEditingId(newId);
    setTempQuestion(newUIQuestion);
  };

  // 2. EDIT CLICK (Transform Backend -> UI)
  const handleEditClick = (q: any) => {
    setEditingId(q._id);
    const choices = q.options ? q.options.map((o: any) => o.text) : [];
    const correctAnswers = q.options 
        ? q.options.filter((o: any) => o.isCorrect).map((o: any) => o.text) 
        : [];

    setTempQuestion({
        ...q,
        question: q.questionText, 
        choices,
        correctAnswers
    });
  };

  // 3. SAVE CLICK (Async)
  const handleSave = async () => {
    // Transform UI data back to Backend 'options' structure
    let backendOptions = [];

    if (tempQuestion.type === "MCQ" || tempQuestion.type === "TRUE_FALSE") {
        backendOptions = tempQuestion.choices.map((choiceText: string) => ({
            text: choiceText,
            isCorrect: tempQuestion.correctAnswers.includes(choiceText)
        }));
    } else if (tempQuestion.type === "FILL_BLANKS") {
        backendOptions = tempQuestion.correctAnswers.map((ans: string) => ({
            text: ans,
            isCorrect: true
        }));
    }

    const payload = {
        title: tempQuestion.title,
        points: tempQuestion.points,
        type: tempQuestion.type,
        questionText: tempQuestion.question, 
        options: backendOptions
    };

    const exists = questions.find((q:any) => q._id === tempQuestion._id);

    // Save to Database
    if (exists) {
        await dispatch(updateQuestion({ quizId: qid as string, question: { ...payload, _id: tempQuestion._id } }));
    } else {
        await dispatch(addQuestion({ quizId: qid as string, question: payload }));
    }

    // Refresh Data
    await dispatch(fetchQuizDetails({ quizId: qid as string, asAdmin: true }));
    
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // 4. DELETE CLICK (Async)
  const handleDelete = async (questionId: string) => {
      await dispatch(deleteQuestion({ quizId: qid as string, questionId }));
      // Optional: Refresh after delete
      dispatch(fetchQuizDetails({ quizId: qid as string, asAdmin: true }));
  };

  // --- Helpers ---
  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...tempQuestion.choices];
    newChoices[index] = value;
    setTempQuestion({ ...tempQuestion, choices: newChoices });
  };
  const addChoice = () => {
    setTempQuestion({ ...tempQuestion, choices: [...tempQuestion.choices, "New Option"] });
  };
  const deleteChoice = (index: number) => {
    const newChoices = tempQuestion.choices.filter((_: any, i: number) => i !== index);
    setTempQuestion({ ...tempQuestion, choices: newChoices });
  };

  return (
    <div className="p-3">
      <div className="text-center mb-4">
        {!editingId || questions.find((q:any) => q._id === editingId) ? (
             <Button variant="secondary" onClick={handleNewQuestion}>+ New Question</Button>
        ) : null}
      </div>

      {[
          ...questions, 
          (editingId && !questions.find((q:any) => q._id === editingId)) ? tempQuestion : null
      ].filter(Boolean).map((q: any) => (
        <Card key={q._id} className="mb-4 shadow-sm">
          {editingId === q._id ? (
            // ================== EDIT MODE ==================
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                 <Form.Control 
                    value={tempQuestion.title} 
                    onChange={(e) => setTempQuestion({...tempQuestion, title: e.target.value})} 
                    placeholder="Title"
                    style={{width: '40%'}}
                 />
                 <Form.Select 
                    value={tempQuestion.type} 
                    onChange={(e) => {
                        let newChoices = [] as any[];
                        if(e.target.value === "MCQ") newChoices = ["Option A", "Option B"];
                        if(e.target.value === "TRUE_FALSE") newChoices = ["True", "False"];
                        setTempQuestion({...tempQuestion, type: e.target.value, choices: newChoices, correctAnswers: []})
                    }}
                    style={{width: '30%'}}
                 >
                    <option value="MCQ">Multiple Choice</option> 
                    <option value="TRUE_FALSE">True/False</option>
                    <option value="FILL_BLANKS">Fill in the Blank</option>
                 </Form.Select>
                 <Form.Control 
                    type="number" 
                    value={tempQuestion.points} 
                    onChange={(e) => setTempQuestion({...tempQuestion, points: parseInt(e.target.value)})} 
                    style={{width: '20%'}}
                 />
              </div>
              <hr />
              <Form.Group className="mb-3">
                <Form.Label>Question Text</Form.Label>
                <Form.Control as="textarea" rows={3} value={tempQuestion.question} onChange={(e) => setTempQuestion({ ...tempQuestion, question: e.target.value })} />
              </Form.Group>

              {/* --- 1. MCQ EDITOR --- */}
              {tempQuestion.type === "MCQ" && (
                 <div>
                    <h6>Answers (Check the correct one)</h6>
                    {tempQuestion.choices?.map((choice: string, idx: number) => (
                        <InputGroup className="mb-2" key={idx}>
                             <InputGroup.Text>
                                <Form.Check 
                                    type="radio" 
                                    name="correct" 
                                    checked={tempQuestion.correctAnswers.includes(choice)}
                                    onChange={() => setTempQuestion({...tempQuestion, correctAnswers: [choice]})}
                                />
                             </InputGroup.Text>
                             <Form.Control value={choice} onChange={(e) => handleChoiceChange(idx, e.target.value)} />
                             <Button variant="outline-danger" onClick={() => deleteChoice(idx)}><FaTrash /></Button>
                        </InputGroup>
                    ))}
                    <div className="text-end">
                        <Button variant="link" className="text-danger" onClick={addChoice}>+ Add Another Answer</Button>
                    </div>
                 </div>
              )}

              {/* --- 2. TRUE/FALSE EDITOR --- */}
              {tempQuestion.type === "TRUE_FALSE" && (
                 <div>
                    <h6>Correct Answer</h6>
                    {["True", "False"].map((opt) => (
                        <Form.Check 
                            key={opt}
                            type="radio"
                            label={opt}
                            name="tf"
                            checked={tempQuestion.correctAnswers.includes(opt)}
                            onChange={() => setTempQuestion({...tempQuestion, correctAnswers: [opt], choices: ["True", "False"]})}
                            className="mb-2"
                        />
                    ))}
                 </div>
              )}

              {/* --- 3. FILL BLANKS EDITOR --- */}
              {tempQuestion.type === "FILL_BLANKS" && (
                 <div>
                     <h6>Possible Correct Answers</h6>
                     {tempQuestion.correctAnswers?.map((ans: string, idx: number) => (
                         <InputGroup className="mb-2" key={idx}>
                            <Form.Control 
                                value={ans} 
                                onChange={(e) => {
                                    const newAns = [...tempQuestion.correctAnswers];
                                    newAns[idx] = e.target.value;
                                    setTempQuestion({...tempQuestion, correctAnswers: newAns});
                                }} 
                            />
                            <Button variant="outline-danger" onClick={() => {
                                const newAns = tempQuestion.correctAnswers.filter((_:any, i:number) => i !== idx);
                                setTempQuestion({...tempQuestion, correctAnswers: newAns});
                            }}><FaTrash /></Button>
                         </InputGroup>
                     ))}
                     <Button variant="link" className="text-danger" onClick={() => setTempQuestion({...tempQuestion, correctAnswers: [...(tempQuestion.correctAnswers||[]), ""]})}>
                        + Add Correct Answer
                     </Button>
                 </div>
              )}
              
               <div className="mt-4 d-flex gap-2">
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="danger" onClick={handleSave}>Update Question</Button>
              </div>
            </Card.Body>
          ) : (
            // ================== PREVIEW MODE ==================
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                    <h5>{q.title}</h5>
                    <div className="text-muted mb-2">{(q.type || "").replace("_", " ")}</div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold">{q.points} pts</span>
                  <Button variant="secondary" size="sm" onClick={() => handleEditClick(q)}>Edit</Button>
                  {/* FIX: Call handleDelete without await here, as void return is fine for onClick */}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(q._id)}><FaTrash /></Button>
                </div>
              </div>
              <hr />
              <p>{q.questionText || q.question}</p>
              
              <div className="ms-3 fst-italic text-muted">
                 {(q.type === "MCQ" || q.type === "TRUE_FALSE") && (
                     <ul>
                        {(q.options || []).map((opt: any, i: number) => (
                            <li key={i} className={opt.isCorrect ? "text-success fw-bold" : ""}>
                                {opt.text}
                            </li>
                        ))}
                     </ul>
                 )}
                 {q.type === "FILL_BLANKS" && (
                     <div>Correct Answers: {q.options?.map((o:any) => o.text).join(", ")}</div>
                 )}
              </div>
            </Card.Body>
          )}
        </Card>
      ))}
    </div>
  );
}