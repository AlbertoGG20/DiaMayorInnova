import userExerciseDataService from "./userExerciseDataService";

const taskSubmitService = async (data, navigate) => {
  const { statementsData, taskId, exerciseId } = data;

  if (!exerciseId) {
    console.error("❌ Error: exerciseId es undefined en taskSubmitService");
    return;
  }

  const mark = Math.floor(Math.random() * 10) + 1;

  const marksAttributes = Object.entries(statementsData).map(([statementId, data]) => ({
    statement_id: statementId,
    mark: mark,
    student_entries_attributes: (data.entries || []).map((entry) => ({
      entry_number: entry.entry_number,
      entry_date: entry.entry_date,
      student_annotations_attributes: (data.annotations || [])
        .filter((annotation) => annotation.student_entry_id === entry.entry_number)
        .map(({ number, account_id, account_number, credit, debit }) => ({
          number,
          account_id: account_id || 9999,
          account_number,
          credit: credit || 0,
          debit: debit || 0,
        })),
    })),
  }));

  const exerciseData = {
    exercise: {
      task_id: taskId,
      marks_attributes: marksAttributes,
    },
  };

  try {
    await userExerciseDataService.update_student_exercise(exerciseId, exerciseData);
    await userExerciseDataService.finish(exerciseId);
    navigate("/home");
  } catch (err) {
    console.error("Error al enviar los datos:", err);
    throw err;
  }
};

export default taskSubmitService;