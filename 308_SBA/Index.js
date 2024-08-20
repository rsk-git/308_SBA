document.addEventListener('DOMContentLoaded', () => {
  // Sample data
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
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };

  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
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

  function getLearnerData(CourseInfo, AssignmentGroupg, LearnerSubmissions) {
    try {
      // Validate course and assignment group
      if (AssignmentGroupg.course_id !== course.id) {
        throw new Error('AssignmentGroup does not belong to the specified course.');
      }

      // Create a map from assignment data for fast retrieval
      const assignmentsMap = new Map();
      AssignmentGroupg.assignments.forEach(a => {
        if (a.points_possible <= 0) {
          throw new Error(`Invalid points_possible value for assignment ID ${a.id}.`);
        }
        assignmentsMap.set(a.id, a);
      });

      // Process learner submissions
      const learners = new Map();
      for (const sub of submissions) {
        const assignment = assignmentsMap.get(sub.assignment_id);
        if (!assignment) {
          throw new Error(`Assignment ID ${sub.assignment_id} not found.`);
        }

        // Skip future-due assignments
        const currentDate = new Date().toISOString().split('T')[0];
        if (assignment.due_at > currentDate) {
          continue; // Skip processing this submission
        }

        let finalScore = sub.submission.score;
        if (sub.submission.submitted_at > assignment.due_at) {
          finalScore -= assignment.points_possible * 0.10;
        }

        if (!learners.has(sub.learner_id)) {
          learners.set(sub.learner_id, { totalScore: 0, totalPoints: 0, scores: {} });
        }
        const learner = learners.get(sub.learner_id);

        learner.totalScore += finalScore;
        learner.totalPoints += assignment.points_possible;
        learner.scores[sub.assignment_id] = finalScore / assignment.points_possible;
      }

      // Compute results
      const results = [];
      learners.forEach((data, learner_id) => {
        const average = data.totalPoints === 0 ? 0 : data.totalScore / data.totalPoints;
        const scores = { id: learner_id, avg: average };
        Object.keys(data.scores).forEach(a_id => {
          scores[a_id] = data.scores[a_id];
        });
        results.push(scores);
      });

      return results;
    } catch (error) {
      console.error('Error processing data:', error.message);
      return [];
    }
  }

  function renderData(data) {
    const tbody = document.getElementById('learner-data');
    tbody.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${(item.avg * 100).toFixed(2)}%</td>
        <td>${(item[1] !== undefined ? (item[1] * 100).toFixed(2) + '%' : 'N/A')}</td>
        <td>${(item[2] !== undefined ? (item[2] * 100).toFixed(2) + '%' : 'N/A')}</td>
        <td>${(item[3] !== undefined ? (item[3] * 100).toFixed(2) + '%' : 'N/A')}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // Process data and render
  // const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  // renderData(result);
});
