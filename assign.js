// name of the course and its ID
const CourseInfo = {
    id: 1,
    name: "Intro to HMTL and CSS"
  };
  
// list of assignments to due within the course
  const AssignmentGroup = {
    id: 1,
    name: "Fundamentals of HTML",
    course_id: 1, // the ID of the course the assignment group belongs to
    group_weight: 100,  // the percentage weight of the entire assignment group
    assignments: [
      {
        id: 1,
        name: "HTML Assignment 1",
        due_at: "2024-11-26",
        points_possible: 100 
      },
      {
        id: 2,
        name: "HTML Assignment 2",
        due_at: "2024-12-02",
        points_possible: 0
      },
      {
        id: 3,
        name: "HTML KBA",
        due_at: "2024-12-10",
        points_possible: 500
      }
    ]
  };
  // provided learner submission data
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2024-11-26",
        score: 89
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2024-12-02",
        score: 0
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  try {
    function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
        // Validate course_id
        if (assignmentGroup.course_id !== courseInfo.id) {
            throw new Error("Invalid assignment group: course_id does not match.");
        }

        const result = []; // This will hold the final results for each learner
        const learnerScores = {}; // Object to accumulate scores for each learner

        // Initialize learnerScores structure
        learnerSubmissions.forEach(submission => {
            const { learner_id } = submission;
            if (!learnerScores[learner_id]) {
                learnerScores[learner_id] = {
                    totalScore: 0,
                    totalPoints: 0,
                    assignments: {}
                };
            }
        });

        for (let i = 0; i < learnerSubmissions.length; i++) {
            const { learner_id, assignment_id, submission } = learnerSubmissions[i];
            const assignment = assignmentGroup.assignments.find(a => a.id === assignment_id);

            if (!assignment) {
                console.log(`Assignment not found for learner ${learner_id}.`);
                continue; // Skip to the next submission
            }

            const { due_at, points_possible } = assignment;

            // Check if points_possible is a valid number
            if (typeof points_possible !== 'number' || points_possible <= 0) {
                console.log(`Invalid points_possible for assignment ${assignment_id}.`);
                continue; // Skip this assignment
            }

            // Check if submission.score is a valid number
            if (typeof submission.score !== 'number') {
                console.log(`Invalid score for submission from learner ${learner_id} on assignment ${assignment_id}.`);
                continue; // Skip this submission
            }

            // Check if the assignment is due
            const submissionDate = new Date(submission.submitted_at);
            const dueDate = new Date(due_at);

            if (submissionDate > dueDate) {
                console.log(`Submission is late for learner ${learner_id}.`);
                // Deduct 10% from points_possible for late submissions
                const adjustedPointsPossible = points_possible * 0.9;
                learnerScores[learner_id].totalScore += Math.min(submission.score, adjustedPointsPossible);
                learnerScores[learner_id].totalPoints += adjustedPointsPossible;
            } else {
                console.log(`Submission is valid and on time for learner ${learner_id}.`);
                learnerScores[learner_id].totalScore += submission.score;
                learnerScores[learner_id].totalPoints += points_possible;
            }

            // Calculate the percentage score for this assignment
            const percentageScore = (submission.score / points_possible) * 100;
            learnerScores[learner_id].assignments[assignment_id] = percentageScore;
        }

        // Construct the result array
        for (const learner_id in learnerScores) {
            const { totalScore, totalPoints, assignments } = learnerScores[learner_id];
            const avg = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0; // Calculate weighted average
            result.push({
                learner_id,
                averageScore: avg,
                assignments
            });
        }

        return result;
    }
} catch (error) {
    console.error("An error occurred:", error);
}

