const courseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

const assignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
      { id: 1, name: "Declare a Variable", due_at: "2023-01-25", points_possible: 50 },
      { id: 2, name: "Write a Function", due_at: "2023-02-27", points_possible: 150 },
      { id: 3, name: "Code the World", due_at: "3156-11-15", points_possible: 500 }
  ]
};

const learnerSubmissions = [
  { learner_id: 125, assignment_id: 1, submission: { submitted_at: "2023-01-25", score: 47 }},
  { learner_id: 125, assignment_id: 2, submission: { submitted_at: "2023-02-12", score: 150 }},
  { learner_id: 125, assignment_id: 3, submission: { submitted_at: "2023-01-25", score: 400 }},
  { learner_id: 132, assignment_id: 1, submission: { submitted_at: "2023-01-24", score: 39 }},
  { learner_id: 132, assignment_id: 2, submission: { submitted_at: "2023-03-07", score: 140 }}
];

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  const learnerScores = {};

  learnerSubmissions.forEach(({ learner_id, assignment_id, submission }) => {
      const assignment = assignmentGroup.assignments.find(a => a.id === assignment_id);
      if (!assignment) return console.error(`Assignment not found for learner ${learner_id}.`);
      
      let score = submission.score;
      try {
          const dueDate = new Date(assignment.due_at);
          const submissionDate = new Date(submission.submitted_at);
          if (submissionDate > dueDate) score = Math.max(0, score - 15);

          if (!learnerScores[learner_id]) learnerScores[learner_id] = { totalScore: 0, submissions: [] };
          learnerScores[learner_id].totalScore += score;
          learnerScores[learner_id].submissions.push({
              assignment_id, assignment_name: assignment.name,
              original_score: submission.score, adjusted_score: score,
              due_date: assignment.due_at, submitted_at: submission.submitted_at
          });
      } catch (error) {
          console.error(`Error processing submission for learner ${learner_id}: ${error.message}`);
      }
  });

  return Object.keys(learnerScores).map(learner_id => ({
      learner_id,
      total_weighted_score: learnerScores[learner_id].totalScore,
      submissions: learnerScores[learner_id].submissions
  }));
}

const result = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
console.log(JSON.stringify(result, null, 2));
