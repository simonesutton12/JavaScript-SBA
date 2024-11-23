const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

const AssignmentGroup = {
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

const LearnerSubmissions = [
  { learner_id: 125, assignment_id: 1, submission: { submitted_at: "2023-01-25", score: 47 } },
  { learner_id: 125, assignment_id: 2, submission: { submitted_at: "2023-02-12", score: 150 } },
  { learner_id: 125, assignment_id: 3, submission: { submitted_at: "2023-01-25", score: 400 } },
  { learner_id: 132, assignment_id: 1, submission: { submitted_at: "2023-01-24", score: 39 } },
  { learner_id: 132, assignment_id: 2, submission: { submitted_at: "2023-03-07", score: 140 } }
];

function getLearnerData(course, ag, submissions) {
  try {
    // Check if assignment group matches the course
    if (ag.course_id !== course.id) {
      throw new Error("Assignment group course_id does not match CourseInfo id");
    }

    // Check if any assignment has zero points possible
    ag.assignments.forEach(assignment => {
      if (assignment.points_possible === 0) {
        throw new Error("Points possible for assignment cannot be zero");
      }
    });

    const results = [];
    const learners = [125, 132];

    // Process each learner's submissions
    learners.forEach(learner => {
      let totalScore = 0;
      let totalPoints = 0;
      const scores = {};

      // Process each assignment for the learner
      ag.assignments.forEach(assignment => {
        const submission = submissions.find(sub => sub.learner_id === learner && sub.assignment_id === assignment.id);

        if (submission) {
          const dueDate = new Date(assignment.due_at);
          const submitDate = new Date(submission.submission.submitted_at);
          let score = submission.submission.score;

          // Deduct 10% for late submission
          if (submitDate > dueDate) {
            score -= assignment.points_possible * 0.1;
            if (score < 0) score = 0;
          }

          scores[assignment.id] = score / assignment.points_possible;
          totalScore += score;
          totalPoints += assignment.points_possible;
        }
      });

      if (totalPoints === 0) {
        throw new Error("Total points possible cannot be zero");
      }

      const avg = totalScore / totalPoints;
      results.push({ id: learner, avg: avg.toFixed(3), ...scores });
    });

    return results;
  } catch (error) {
    console.error(error.message);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log("Learner Assignments", result);
