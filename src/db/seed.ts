import bcrypt from 'bcryptjs';
import type { DatabaseSchema } from './database.ts';

export async function generateInitialSeed(): Promise<DatabaseSchema> {
  const salt = await bcrypt.genSalt(10);
  const hashAdmin = await bcrypt.hash('Founder@123', salt);
  const hashTeacher = await bcrypt.hash('Teacher@123', salt);
  const hashStudent = await bcrypt.hash('Student@123', salt);

  const users = [
    {
      id: 'usr_founder_1',
      name: 'Arpit Ghorpade',
      email: 'admin@mornicreativelab.com',
      role: 'FOUNDER_ADMIN' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Founder & Vision Lead at Morni Creative Lab. Passionate about hands-on creative technology and design-first education.',
      phone: '+91 98230 11223',
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'usr_teacher_1',
      name: 'Sunita Rao',
      email: 'teacher.sunita@mornicreativelab.com',
      role: 'TEACHER' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Design Educator & Visual Arts Director. 12+ years mentoring young creators across India.',
      schoolId: 'sch_1',
      schoolName: 'Delhi Public Academy',
      phone: '+91 98110 54321',
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'usr_teacher_2',
      name: 'Rahul Mehta',
      email: 'teacher.rahul@mornicreativelab.com',
      role: 'TEACHER' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Robotics & Creative Coding Mentor. Former Maker Space Lead at IIT Bombay incubator.',
      schoolId: 'sch_2',
      schoolName: "St. Xavier's International School",
      phone: '+91 97220 88990',
      createdAt: '2026-01-18T11:00:00Z',
      updatedAt: '2026-01-18T11:00:00Z',
    },
    {
      id: 'usr_student_1',
      name: 'Aarav Sharma',
      email: 'aarav@student.mornicreativelab.com',
      role: 'STUDENT' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      bio: 'High school designer interested in typography, mobile interfaces, and digital prototyping.',
      schoolId: 'sch_1',
      schoolName: 'Delhi Public Academy',
      phone: '+91 91234 56780',
      createdAt: '2026-02-01T08:00:00Z',
      updatedAt: '2026-02-01T08:00:00Z',
    },
    {
      id: 'usr_student_2',
      name: 'Diya Patel',
      email: 'diya@student.mornicreativelab.com',
      role: 'STUDENT' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Passionate about digital illustration, motion graphics, and animated short films.',
      schoolId: 'sch_2',
      schoolName: "St. Xavier's International School",
      phone: '+91 94567 89012',
      createdAt: '2026-02-05T12:00:00Z',
      updatedAt: '2026-02-05T12:00:00Z',
    },
    {
      id: 'usr_student_3',
      name: 'Kabir Verma',
      email: 'kabir@student.mornicreativelab.com',
      role: 'STUDENT' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Physical computing enthusiast building smart sensor devices and mini robots.',
      schoolId: 'sch_3',
      schoolName: 'Cambridge Global School',
      phone: '+91 99887 65432',
      createdAt: '2026-02-10T14:00:00Z',
      updatedAt: '2026-02-10T14:00:00Z',
    },
  ];

  const passwords: Record<string, string> = {
    usr_founder_1: hashAdmin,
    usr_teacher_1: hashTeacher,
    usr_teacher_2: hashTeacher,
    usr_student_1: hashStudent,
    usr_student_2: hashStudent,
    usr_student_3: hashStudent,
  };

  const schools = [
    {
      id: 'sch_1',
      name: 'Delhi Public Academy',
      code: 'DPA-ND-101',
      city: 'New Delhi',
      state: 'Delhi',
      contactEmail: 'lab@delhipublicacademy.edu.in',
      contactPhone: '+91 11 2684 9900',
      studentCount: 240,
      teacherCount: 14,
      active: true,
      createdAt: '2026-01-05T09:00:00Z',
    },
    {
      id: 'sch_2',
      name: "St. Xavier's International School",
      code: 'SXI-MUM-204',
      city: 'Mumbai',
      state: 'Maharashtra',
      contactEmail: 'creativelab@stxaviersintl.edu.in',
      contactPhone: '+91 22 2200 4455',
      studentCount: 185,
      teacherCount: 11,
      active: true,
      createdAt: '2026-01-08T10:30:00Z',
    },
    {
      id: 'sch_3',
      name: 'Cambridge Global School',
      code: 'CGS-BLR-309',
      city: 'Bengaluru',
      state: 'Karnataka',
      contactEmail: 'stem@cambridgeglobal.ac.in',
      contactPhone: '+91 80 4120 7788',
      studentCount: 310,
      teacherCount: 18,
      active: true,
      createdAt: '2026-01-12T11:15:00Z',
    },
  ];

  const programs = [
    {
      id: 'prg_uiux',
      title: 'UI/UX Design & Product Prototyping',
      slug: 'ui-ux-design-prototyping',
      description: 'Master digital product design from user personas to high-fidelity wireframing, design systems, micro-interactions, and usable prototypes.',
      category: 'Design & Visual Arts' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932dede?w=800&auto=format&fit=crop&q=80',
      difficulty: 'Intermediate' as const,
      durationWeeks: 10,
      skillsCount: 3,
      totalXp: 1800,
      published: true,
      featured: true,
      createdAt: '2026-01-10T12:00:00Z',
    },
    {
      id: 'prg_robotics',
      title: 'Creative Robotics & Physical Computing',
      slug: 'creative-robotics-physical-computing',
      description: 'Bridge hardware and software. Code microcontrollers, wire sensors, build autonomous mini-rovers, and create responsive kinetic art.',
      category: 'Robotics & Coding' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      difficulty: 'Beginner' as const,
      durationWeeks: 8,
      skillsCount: 2,
      totalXp: 1500,
      published: true,
      featured: true,
      createdAt: '2026-01-12T14:00:00Z',
    },
    {
      id: 'prg_animation',
      title: 'Digital Storytelling & 2D Animation',
      slug: 'digital-storytelling-animation',
      description: 'Discover the 12 principles of animation, frame-by-frame character design, narrative storyboarding, and sound synchronization.',
      category: 'Animation & 3D' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      difficulty: 'Beginner' as const,
      durationWeeks: 6,
      skillsCount: 2,
      totalXp: 1200,
      published: true,
      featured: false,
      createdAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'prg_game_dev',
      title: 'Game Design & Creative Coding',
      slug: 'game-design-creative-coding',
      description: 'Design mechanics, physics, procedural audio, and pixel-perfect environments for 2D indie games using modern JavaScript and Canvas.',
      category: 'Robotics & Coding' as const,
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      difficulty: 'Advanced' as const,
      durationWeeks: 12,
      skillsCount: 3,
      totalXp: 2200,
      published: true,
      featured: true,
      createdAt: '2026-01-20T10:00:00Z',
    },
  ];

  const skills = [
    // UI/UX Skills
    {
      id: 'skl_uiux_1',
      programId: 'prg_uiux',
      title: 'Design Foundations & Visual Hierarchy',
      description: 'Master typographic scales, whitespace, contrast ratios, and layout grids.',
      order: 1,
      levelsCount: 2,
      iconName: 'LayoutGrid',
    },
    {
      id: 'skl_uiux_2',
      programId: 'prg_uiux',
      title: 'Components & Design Systems',
      description: 'Build atomic UI libraries with variants, design tokens, and accessibility standards.',
      order: 2,
      levelsCount: 2,
      iconName: 'Component',
    },
    {
      id: 'skl_uiux_3',
      programId: 'prg_uiux',
      title: 'Interactive Prototyping & Usability Testing',
      description: 'Create realistic click-through flows, smart animations, and run moderated user test sessions.',
      order: 3,
      levelsCount: 1,
      iconName: 'Workflow',
    },

    // Robotics Skills
    {
      id: 'skl_rob_1',
      programId: 'prg_robotics',
      title: 'Circuits, Voltage & Microcontrollers',
      description: 'Learn breadboard wiring, Ohm’s Law, digital I/O, and PWM signals.',
      order: 1,
      levelsCount: 2,
      iconName: 'Cpu',
    },
    {
      id: 'skl_rob_2',
      programId: 'prg_robotics',
      title: 'Sensors, Actuators & Motor Control',
      description: 'Interfacing ultrasonic distance sensors, servo motors, and infrared receivers.',
      order: 2,
      levelsCount: 2,
      iconName: 'Bot',
    },
  ];

  const levels = [
    // Levels for skl_uiux_1
    {
      id: 'lvl_uiux_1_1',
      skillId: 'skl_uiux_1',
      title: 'Level 1: Typography & Contrast',
      levelNumber: 1,
      description: 'Understanding font pairings, modular scale, and WCAG AA contrast compliance.',
      xpReward: 150,
      requiredXp: 0,
    },
    {
      id: 'lvl_uiux_1_2',
      skillId: 'skl_uiux_1',
      title: 'Level 2: The 8pt Grid & Spatial Systems',
      levelNumber: 2,
      description: 'Structuring responsive containers with consistent padding and gutter rules.',
      xpReward: 200,
      requiredXp: 150,
    },
    // Levels for skl_uiux_2
    {
      id: 'lvl_uiux_2_1',
      skillId: 'skl_uiux_2',
      title: 'Level 1: Buttons, Inputs & Micro-states',
      levelNumber: 1,
      description: 'Designing interactive states: default, hover, focused, disabled, and loading.',
      xpReward: 250,
      requiredXp: 350,
    },
    // Levels for skl_rob_1
    {
      id: 'lvl_rob_1_1',
      skillId: 'skl_rob_1',
      title: 'Level 1: Electric Currents & Breadboard Basics',
      levelNumber: 1,
      description: 'Building your first closed circuit and controlling an LED using digital logic.',
      xpReward: 150,
      requiredXp: 0,
    },
  ];

  const lessons = [
    // Lesson 1: UI/UX Level 1.1
    {
      id: 'lsn_uiux_1',
      levelId: 'lvl_uiux_1_1',
      skillId: 'skl_uiux_1',
      programId: 'prg_uiux',
      title: 'Foundations of Modern Typography in Product Design',
      order: 1,
      type: 'video' as const,
      durationMinutes: 20,
      xpAward: 50,
      content: `### Welcome to Typography Foundations
In digital products, text accounts for more than 90% of the UI. When you choose typography purposefully:
1. **Legibility & Readability**: Distinguish between fonts built for headings vs continuous body text.
2. **Modular Scale**: Use ratio increments (e.g. 1.25 Major Third: 12px, 16px, 20px, 25px, 31px, 39px) instead of arbitrary values.
3. **Line Height (Leading)**: Keep body copy line height at 140%–160% of font size for optimal scan speed.

#### Core takeaway:
Pair an expressive display typeface for titles with a neutral, highly legible sans-serif for UI elements and forms.`,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      instructions: 'Watch the video overview and take notes on the modular scale calculation.',
    },
    // Lesson 2: UI/UX Level 1.1 - Quiz
    {
      id: 'lsn_uiux_2',
      levelId: 'lvl_uiux_1_1',
      skillId: 'skl_uiux_1',
      programId: 'prg_uiux',
      title: 'Knowledge Check: Contrast & Readability',
      order: 2,
      type: 'quiz' as const,
      durationMinutes: 10,
      xpAward: 50,
      content: 'Test your understanding of typography hierarchy, WCAG contrast thresholds, and leading.',
      quizQuestions: [
        {
          id: 'q1',
          prompt: 'What is the minimum WCAG 2.1 AA contrast ratio required for normal body text against its background?',
          options: [
            { id: 'o1', text: '3.0:1', isCorrect: false },
            { id: 'o2', text: '4.5:1', isCorrect: true },
            { id: 'o3', text: '7.0:1', isCorrect: false },
            { id: 'o4', text: '2.1:1', isCorrect: false },
          ],
          explanation: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text (< 18pt or < 14pt bold).',
        },
        {
          id: 'q2',
          prompt: 'Which modular scale ratio is commonly referred to as the "Major Third"?',
          options: [
            { id: 'o5', text: '1.250', isCorrect: true },
            { id: 'o6', text: '1.414', isCorrect: false },
            { id: 'o7', text: '1.618', isCorrect: false },
            { id: 'o8', text: '1.125', isCorrect: false },
          ],
          explanation: 'Major Third uses a 1.25 ratio factor, producing harmoniously balanced font step-ups.',
        },
      ],
    },
    // Lesson 3: UI/UX Level 1.1 - Assignment Project
    {
      id: 'lsn_uiux_3',
      levelId: 'lvl_uiux_1_1',
      skillId: 'skl_uiux_1',
      programId: 'prg_uiux',
      title: 'Project Milestone: Mobile App Type Specimen Sheet',
      order: 3,
      type: 'assignment' as const,
      durationMinutes: 45,
      xpAward: 100,
      content: `Create a comprehensive type scale specimen sheet for a fictional health & wellness mobile app.
Include:
- Display / H1 (Hero screen)
- H2, H3 (Card headers & Section titles)
- Body Large & Body Regular
- Caption & Button label specs
- Font weights, line-heights, and letter-spacing values.`,
      instructions: 'Submit your design file as PDF, PNG, or JPG. Ensure your contrast notes are visible in the margin annotations.',
      rubric: '1. Visual hierarchy clarity (40%)\n2. Math consistency in modular scale (30%)\n3. Contrast AA compliance (30%)',
    },

    // Lesson 4: UI/UX Level 1.2
    {
      id: 'lsn_uiux_4',
      levelId: 'lvl_uiux_1_2',
      skillId: 'skl_uiux_1',
      programId: 'prg_uiux',
      title: 'Mastering the 8-Point Spatial System',
      order: 1,
      type: 'reading' as const,
      durationMinutes: 25,
      xpAward: 60,
      content: `### Why the 8-Point Grid Works
Modern screen resolutions are divisible by 8 (e.g. 375, 414, 768, 1080, 1440).
Using increments of 8 (8, 16, 24, 32, 40, 48, 64px) for padding, margins, and component heights:
- Eliminates endless micro-debates on spacing.
- Guarantees seamless collaboration with front-end engineers using Tailwind (\`p-2\` = 8px, \`p-4\` = 16px, \`p-6\` = 24px).
- Creates rhythm that subconscious eyes immediately perceive as professional and polished.`,
    },

    // Lesson 5: Robotics Level 1.1
    {
      id: 'lsn_rob_1',
      levelId: 'lvl_rob_1_1',
      skillId: 'skl_rob_1',
      programId: 'prg_robotics',
      title: 'Circuit Physics: Ohm’s Law & Current Safety',
      order: 1,
      type: 'video' as const,
      durationMinutes: 20,
      xpAward: 50,
      content: `### Understanding V = I × R
In this lesson, we explore how Voltage (electric potential), Current (rate of electron flow in Amperes), and Resistance (Ohms) interact.
Learn why putting a 220Ω or 330Ω resistor in series with a 5V LED is mandatory to avoid burning out the diode.`,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
  ];

  const projects = [
    {
      id: 'prj_uiux_specimen',
      lessonId: 'lsn_uiux_3',
      programId: 'prg_uiux',
      title: 'Mobile App Typography Specimen & Token System',
      brief: 'Design and document a complete typographic system for a mobile app, including type hierarchy, modular sizing, and WCAG contrast validation.',
      requirements: [
        'Define minimum 5 typographic tokens (H1, H2, Body, Caption, Button)',
        'Specify font family, weight, size in px, line-height, and tracking',
        'Verify contrast ratio >= 4.5:1 against chosen surface color',
        'Include at least one mock screen showing the hierarchy in real context',
      ],
      allowedFileTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
      maxFileSizeMb: 25,
      maxScore: 100,
      dueDate: '2026-10-25T23:59:59Z',
    },
  ];

  const enrollments = [
    {
      id: 'enr_1',
      studentId: 'usr_student_1',
      programId: 'prg_uiux',
      progressPercent: 66,
      currentSkillId: 'skl_uiux_1',
      currentLevelId: 'lvl_uiux_1_1',
      currentLessonId: 'lsn_uiux_3',
      status: 'active' as const,
      enrolledAt: '2026-02-02T10:00:00Z',
    },
    {
      id: 'enr_2',
      studentId: 'usr_student_2',
      programId: 'prg_animation',
      progressPercent: 100,
      status: 'completed' as const,
      enrolledAt: '2026-01-20T10:00:00Z',
      completedAt: '2026-02-28T16:00:00Z',
    },
    {
      id: 'enr_3',
      studentId: 'usr_student_3',
      programId: 'prg_robotics',
      progressPercent: 30,
      currentSkillId: 'skl_rob_1',
      currentLevelId: 'lvl_rob_1_1',
      currentLessonId: 'lsn_rob_1',
      status: 'active' as const,
      enrolledAt: '2026-02-12T14:00:00Z',
    },
  ];

  const progress = [
    {
      id: 'prog_1',
      studentId: 'usr_student_1',
      lessonId: 'lsn_uiux_1',
      levelId: 'lvl_uiux_1_1',
      skillId: 'skl_uiux_1',
      programId: 'prg_uiux',
      completed: true,
      timeSpentMinutes: 22,
      completedAt: '2026-02-03T11:20:00Z',
      xpAwarded: 50,
    },
    {
      id: 'prog_2',
      studentId: 'usr_student_1',
      lessonId: 'lsn_uiux_2',
      levelId: 'lvl_uiux_1_1',
      skillId: 'skl_uiux_1',
      programId: 'prg_uiux',
      completed: true,
      score: 100,
      timeSpentMinutes: 12,
      completedAt: '2026-02-03T11:35:00Z',
      xpAwarded: 50,
    },
  ];

  const submissions = [
    {
      id: 'sub_1',
      projectId: 'prj_uiux_specimen',
      projectTitle: 'Mobile App Typography Specimen & Token System',
      lessonId: 'lsn_uiux_3',
      programId: 'prg_uiux',
      studentId: 'usr_student_1',
      studentName: 'Aarav Sharma',
      studentEmail: 'aarav@student.mornicreativelab.com',
      teacherId: 'usr_teacher_1',
      status: 'approved' as const,
      title: 'FitTrack Mobile — Type Specimen & Grid Exploration',
      description: 'Submitted my completed type scale using Plus Jakarta Sans and Inter, with a 1.25 modular scale. Evaluated on dark and light surfaces.',
      attachments: [
        {
          id: 'att_1',
          fileName: 'fittrack-typography-system.pdf',
          fileSize: 4200000,
          fileType: 'application/pdf',
          url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        },
      ],
      score: 95,
      maxScore: 100,
      feedback: 'Outstanding work, Aarav! Your modular scale is mathematically rigorous and the contrast annotations demonstrate clear WCAG AA adherence. Great attention to micro-labels.',
      teacherNotes: 'Solid candidate for advanced portfolio feature showcase.',
      submittedAt: '2026-02-15T16:30:00Z',
      reviewedAt: '2026-02-16T10:15:00Z',
      version: 1,
    },
    {
      id: 'sub_2',
      projectId: 'prj_uiux_specimen',
      projectTitle: 'Mobile App Typography Specimen & Token System',
      lessonId: 'lsn_uiux_3',
      programId: 'prg_uiux',
      studentId: 'usr_student_3',
      studentName: 'Kabir Verma',
      studentEmail: 'kabir@student.mornicreativelab.com',
      teacherId: 'usr_teacher_1',
      status: 'under_review' as const,
      title: 'RoboHub Interface Typography System Draft',
      description: 'First version of the dark-mode typography palette for robot telemetry dashboards.',
      attachments: [
        {
          id: 'att_2',
          fileName: 'robowatch-spec.png',
          fileSize: 1800000,
          fileType: 'image/png',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        },
      ],
      maxScore: 100,
      submittedAt: '2026-02-20T14:10:00Z',
      version: 1,
    },
  ];

  const xpTransactions = [
    {
      id: 'xp_1',
      studentId: 'usr_student_1',
      amount: 50,
      source: 'lesson_completed' as const,
      referenceId: 'lsn_uiux_1',
      description: 'Completed lesson: Foundations of Modern Typography',
      createdAt: '2026-02-03T11:20:00Z',
    },
    {
      id: 'xp_2',
      studentId: 'usr_student_1',
      amount: 50,
      source: 'quiz_passed' as const,
      referenceId: 'lsn_uiux_2',
      description: 'Scored 100% on Contrast & Readability Quiz',
      createdAt: '2026-02-03T11:35:00Z',
    },
    {
      id: 'xp_3',
      studentId: 'usr_student_1',
      amount: 250,
      source: 'assignment_approved' as const,
      referenceId: 'sub_1',
      description: 'Project Approved: FitTrack Mobile Type Specimen (Score 95/100)',
      createdAt: '2026-02-16T10:15:00Z',
    },
    {
      id: 'xp_4',
      studentId: 'usr_student_2',
      amount: 1200,
      source: 'lesson_completed' as const,
      referenceId: 'prg_animation',
      description: 'Completed Full Program: Digital Storytelling & 2D Animation',
      createdAt: '2026-02-28T16:00:00Z',
    },
    {
      id: 'xp_5',
      studentId: 'usr_student_3',
      amount: 150,
      source: 'streak_bonus' as const,
      referenceId: 'streak_week_1',
      description: '7-Day Continuous Learning Streak bonus',
      createdAt: '2026-02-18T10:00:00Z',
    },
  ];

  const badges = [
    {
      id: 'bdg_first_step',
      title: 'First Creative Step',
      description: 'Completed your first lesson at Morni Creative Lab.',
      category: 'Mastery' as const,
      icon: 'Footprints',
      xpRequired: 50,
    },
    {
      id: 'bdg_craft_master',
      title: 'Pixel Artisan',
      description: 'Earned 300+ XP in visual design and product thinking.',
      category: 'Creativity' as const,
      icon: 'Palette',
      xpRequired: 300,
    },
    {
      id: 'bdg_streak_hero',
      title: 'Unstoppable Maker',
      description: 'Achieved an active 5-day continuous learning streak.',
      category: 'Consistency' as const,
      icon: 'Flame',
      xpRequired: 500,
    },
    {
      id: 'bdg_program_grad',
      title: 'Certified Graduate',
      description: 'Graduated from a full educational program with exemplary review.',
      category: 'Mastery' as const,
      icon: 'Award',
      xpRequired: 1000,
    },
  ];

  const userBadges = [
    { userId: 'usr_student_1', badgeId: 'bdg_first_step', unlockedAt: '2026-02-03T11:20:00Z' },
    { userId: 'usr_student_1', badgeId: 'bdg_craft_master', unlockedAt: '2026-02-16T10:15:00Z' },
    { userId: 'usr_student_2', badgeId: 'bdg_first_step', unlockedAt: '2026-01-22T09:00:00Z' },
    { userId: 'usr_student_2', badgeId: 'bdg_program_grad', unlockedAt: '2026-02-28T16:00:00Z' },
    { userId: 'usr_student_3', badgeId: 'bdg_first_step', unlockedAt: '2026-02-14T12:00:00Z' },
  ];

  const streaks = {
    usr_student_1: {
      currentStreak: 6,
      longestStreak: 12,
      lastActiveDate: '2026-10-04',
      totalDaysActive: 28,
    },
    usr_student_2: {
      currentStreak: 14,
      longestStreak: 21,
      lastActiveDate: '2026-10-04',
      totalDaysActive: 45,
    },
    usr_student_3: {
      currentStreak: 3,
      longestStreak: 7,
      lastActiveDate: '2026-10-03',
      totalDaysActive: 16,
    },
  };

  const certificates = [
    {
      id: 'cert_diya_anim_1',
      verificationCode: 'MCL-2026-884192',
      studentId: 'usr_student_2',
      studentName: 'Diya Patel',
      programId: 'prg_animation',
      programTitle: 'Digital Storytelling & 2D Animation',
      issueDate: '2026-03-01',
      grade: 'Exemplary (A+)',
      finalScore: 98,
      instructorName: 'Prof. Sunita Rao, Creative Director',
      founderSignature: 'Arpit Ghorpade, Founder Morni Creative Lab',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MCL-2026-884192',
    },
  ];

  const liveClasses = [
    {
      id: 'live_1',
      title: 'Interactive Studio Critique: Design Systems & Component Variants',
      programId: 'prg_uiux',
      programTitle: 'UI/UX Design & Product Prototyping',
      teacherId: 'usr_teacher_1',
      teacherName: 'Sunita Rao',
      schoolId: 'sch_1',
      date: '2026-10-06',
      startTime: '16:00',
      endTime: '17:30',
      meetingLink: 'https://meet.google.com/mcl-uiux-studio',
      description: 'Live teardown and feedback session on student wireframes and component variant tokens.',
      status: 'upcoming' as const,
      enrolledStudentsCount: 24,
    },
    {
      id: 'live_2',
      title: 'Live Lab: Wiring Ultrasonic Sensors to Microcontrollers',
      programId: 'prg_robotics',
      programTitle: 'Creative Robotics & Physical Computing',
      teacherId: 'usr_teacher_2',
      teacherName: 'Rahul Mehta',
      schoolId: 'sch_2',
      date: '2026-10-07',
      startTime: '15:00',
      endTime: '16:30',
      meetingLink: 'https://meet.google.com/mcl-robotics-lab',
      description: 'Step-by-step breadboard assembly and debugging serial communication over USB.',
      status: 'upcoming' as const,
      enrolledStudentsCount: 18,
    },
    {
      id: 'live_3',
      title: 'Animation Masterclass: Timing & Anticipation Principles',
      programId: 'prg_animation',
      programTitle: 'Digital Storytelling & 2D Animation',
      teacherId: 'usr_teacher_1',
      teacherName: 'Sunita Rao',
      date: '2026-10-02',
      startTime: '14:00',
      endTime: '15:30',
      meetingLink: 'https://meet.google.com/mcl-anim-critique',
      description: 'Dissecting 24fps keyframes and secondary motion.',
      status: 'completed' as const,
      enrolledStudentsCount: 30,
    },
  ];

  const attendance = [
    {
      id: 'att_rec_1',
      liveClassId: 'live_3',
      studentId: 'usr_student_1',
      studentName: 'Aarav Sharma',
      status: 'present' as const,
      remarks: 'Active participant, shared screen during exercise.',
      markedAt: '2026-10-02T14:05:00Z',
    },
    {
      id: 'att_rec_2',
      liveClassId: 'live_3',
      studentId: 'usr_student_2',
      studentName: 'Diya Patel',
      status: 'present' as const,
      remarks: 'Submitted final render on time.',
      markedAt: '2026-10-02T14:02:00Z',
    },
    {
      id: 'att_rec_3',
      liveClassId: 'live_3',
      studentId: 'usr_student_3',
      studentName: 'Kabir Verma',
      status: 'excused' as const,
      remarks: 'School science olympiad competition.',
      markedAt: '2026-10-02T14:00:00Z',
    },
  ];

  const notifications = [
    {
      id: 'notif_1',
      userId: 'usr_student_1',
      title: 'Submission Approved with 95/100',
      message: 'Teacher Sunita Rao reviewed your FitTrack Mobile Type Specimen project.',
      type: 'review' as const,
      linkUrl: '/student/projects',
      read: false,
      createdAt: '2026-02-16T10:15:00Z',
    },
    {
      id: 'notif_2',
      userId: 'usr_student_1',
      title: 'Upcoming Studio Critique',
      message: 'Live session scheduled for tomorrow at 4:00 PM with Sunita Rao.',
      type: 'live_class' as const,
      linkUrl: '/student/live-classes',
      read: true,
      createdAt: '2026-10-04T12:00:00Z',
    },
  ];

  const paymentPlans = [
    {
      id: 'plan_starter',
      name: 'Creative Explorer',
      description: 'Ideal for individual students starting their creative journey.',
      priceInr: 1499,
      billingInterval: 'monthly' as const,
      features: [
        'Access to 2 enrolled programs',
        'Teacher feedback on all assignments',
        'MORNI MITR AI Learning Assistant (30 prompts/day)',
        'Verified digital certificates upon completion',
        'Access to community showcase',
      ],
      popular: false,
    },
    {
      id: 'plan_pro',
      name: 'Maker Pro Studio',
      description: 'Comprehensive access to all programs, live classes, and 1-on-1 mentor critiques.',
      priceInr: 3999,
      billingInterval: 'monthly' as const,
      features: [
        'All 4 Creative Lab programs unlocked',
        'Weekly live studio critiques with senior mentors',
        'Priority project review turnaround (< 24 hrs)',
        'Unlimited MORNI MITR AI mentor assistance',
        'Physical maker kit shipped directly to your door',
        'Verifiable credentials & portfolio review',
      ],
      popular: true,
    },
    {
      id: 'plan_school',
      name: 'Institutional / School Lab',
      description: 'Custom implementation for K-12 schools, maker spaces, and learning centers.',
      priceInr: 29999,
      billingInterval: 'annual' as const,
      features: [
        'Up to 150 student accounts',
        'Teacher co-pilot dashboard & attendance tracking',
        'Custom curriculum alignment (CBSE, ICSE, IB, Cambridge)',
        'School-branded verification portal & certificates',
        'Dedicated onboarding manager & teacher training',
      ],
      popular: false,
    },
  ];

  const payments = [
    {
      id: 'pay_1',
      userId: 'usr_student_1',
      userName: 'Aarav Sharma',
      userEmail: 'aarav@student.mornicreativelab.com',
      planId: 'plan_pro',
      planName: 'Maker Pro Studio',
      amountInr: 3999,
      currency: 'INR',
      razorpayPaymentId: 'pay_Nz82hK91xKl109',
      razorpayOrderId: 'order_Nx71vK999aa2',
      status: 'completed' as const,
      invoiceNumber: 'INV-2026-0041',
      createdAt: '2026-02-01T08:15:00Z',
    },
    {
      id: 'pay_2',
      userId: 'usr_student_2',
      userName: 'Diya Patel',
      userEmail: 'diya@student.mornicreativelab.com',
      planId: 'plan_starter',
      planName: 'Creative Explorer',
      amountInr: 1499,
      currency: 'INR',
      razorpayPaymentId: 'pay_Mm91pL88jJ201',
      razorpayOrderId: 'order_Lk60vB777bb1',
      status: 'completed' as const,
      invoiceNumber: 'INV-2026-0042',
      createdAt: '2026-01-20T10:05:00Z',
    },
  ];

  const materials = [
    {
      id: 'mat_1',
      title: 'Mobile UI Wireframe Kit (Figma Community (.fig))',
      category: 'Template' as const,
      programId: 'prg_uiux',
      fileType: 'FIGMA',
      fileSize: '12.4 MB',
      downloadUrl: '#',
      description: 'Comprehensive 8pt grid components, auto-layout cards, and typography specimen guides.',
    },
    {
      id: 'mat_2',
      title: 'Microcontroller Pinout Cheat Sheet & Sensor Wiring Diagrams',
      category: 'Guide' as const,
      programId: 'prg_robotics',
      fileType: 'PDF',
      fileSize: '3.8 MB',
      downloadUrl: '#',
      description: 'High-resolution schematics for breadboard circuits, motor drivers, and I2C LCD displays.',
    },
    {
      id: 'mat_3',
      title: '12 Principles of Animation Reference Flipbook',
      category: 'Asset Pack' as const,
      programId: 'prg_animation',
      fileType: 'ZIP',
      fileSize: '45.1 MB',
      downloadUrl: '#',
      description: 'High-framerate looping examples of squash & stretch, anticipation, and follow-through.',
    },
  ];

  const leads = [
    {
      id: 'lead_1',
      type: 'book_demo' as const,
      name: 'Ritu Sen',
      email: 'ritu.sen@dpsnoida.edu.in',
      phone: '+91 98101 23456',
      organization: 'Delhi Public School, Noida',
      role: 'Head of Innovation & ATL Lab',
      studentCountEstimate: 450,
      message: 'Looking to integrate Morni Creative Lab hands-on robotics and design thinking into our Grades 6–9 curriculum for next academic term.',
      status: 'qualified' as const,
      createdAt: '2026-10-01T11:00:00Z',
    },
    {
      id: 'lead_2',
      type: 'school_partnership' as const,
      name: 'Vikram Singhania',
      email: 'principal@greenwoodhigh.ac.in',
      phone: '+91 99000 88776',
      organization: 'Greenwood High International School',
      role: 'Principal',
      studentCountEstimate: 320,
      message: 'Interested in the Teacher Co-Pilot and custom school certificates.',
      status: 'contacted' as const,
      createdAt: '2026-10-03T15:20:00Z',
    },
  ];

  const auditLogs = [
    {
      id: 'audit_init_1',
      userId: 'usr_founder_1',
      userRole: 'FOUNDER_ADMIN' as const,
      userName: 'Arpit Ghorpade',
      action: 'SYSTEM_BOOTSTRAP',
      entityType: 'System',
      entityId: 'sys_root',
      details: 'Morni Creative Lab production database engine initialized with verified schema.',
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'audit_init_2',
      userId: 'usr_teacher_1',
      userRole: 'TEACHER' as const,
      userName: 'Sunita Rao',
      action: 'SUBMISSION_REVIEWED',
      entityType: 'Submission',
      entityId: 'sub_1',
      details: 'Reviewed and approved Aarav Sharma submission for Mobile App Typography Specimen with score 95.',
      createdAt: '2026-02-16T10:15:00Z',
    },
  ];

  return {
    users,
    passwords,
    schools,
    programs,
    skills,
    levels,
    lessons,
    enrollments,
    progress,
    projects,
    submissions,
    xpTransactions,
    badges,
    userBadges,
    streaks,
    certificates,
    liveClasses,
    attendance,
    notifications,
    paymentPlans,
    payments,
    materials,
    leads,
    auditLogs,
    aiConfig: {
      enabled: true,
      model: 'gemini-3.8-flash',
      systemPrompt: 'You are Morni Mitr, an encouraging, pedagogically sound AI learning mentor at Morni Creative Lab. Help students understand design, coding, storytelling, and robotics. Do NOT do their homework or write complete graded assignments for them. Guide them step-by-step with analogies, hints, and practice suggestions.',
      dailyStudentLimit: 30,
      allowedModes: ['explain', 'summarize', 'hint', 'practice'],
    },
    aiUsageLogs: [],
  };
}
