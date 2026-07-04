USE campus_placement_portal;

INSERT INTO users (name, email, password_hash, role) VALUES
('Aarav Student', 'student@example.com', '$2b$12$uY/8hlKYutrgYV1SAeMF1OM1U6YrCks5RaSl1MNYweGLdMIySRBAO', 'student'),
('Riya Recruiter', 'recruiter@example.com', '$2b$12$uY/8hlKYutrgYV1SAeMF1OM1U6YrCks5RaSl1MNYweGLdMIySRBAO', 'recruiter'),
('Admin User', 'admin@example.com', '$2b$12$uY/8hlKYutrgYV1SAeMF1OM1U6YrCks5RaSl1MNYweGLdMIySRBAO', 'admin');

INSERT INTO profiles (user_id, phone, department, graduation_year, cgpa, skills, resume_url, bio) VALUES
(1, '9876543210', 'Computer Science', 2026, 8.70, 'React, TypeScript, SQL, Node.js', 'https://example.com/resume-aarav.pdf', 'Final year student interested in full stack development.');

INSERT INTO companies (recruiter_id, name, website, location, description) VALUES
(2, 'BluePeak Technologies', 'https://bluepeak.example.com', 'Bengaluru', 'Product engineering company hiring campus talent.');

INSERT INTO jobs (
  company_id,
  recruiter_id,
  title,
  description,
  location,
  salary,
  job_type,
  eligibility_criteria,
  deadline,
  status
) VALUES
(1, 2, 'Frontend Developer Intern', 'Work with React and TypeScript to build dashboard features.', 'Remote', '25000/month', 'internship', 'CS/IT students with CGPA 7.0 and above.', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'open'),
(1, 2, 'Junior Full Stack Developer', 'Build and maintain Express APIs and React pages.', 'Bengaluru', '6 LPA', 'full-time', 'Strong fundamentals in JavaScript, SQL, and REST APIs.', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'open');

INSERT INTO applications (job_id, student_id, status, cover_letter) VALUES
(1, 1, 'applied', 'I am excited to apply my React and TypeScript skills to this internship.');
