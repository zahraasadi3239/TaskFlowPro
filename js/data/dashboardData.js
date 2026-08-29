/* ========================================
   DASHBOARD DATA
======================================== */

export const dashboardData = {
  /* ========================================
     STATS
  ======================================== */

  stats: {
    totalTasks: 24,
    completedTasks: 16,
    inProgressTasks: 8,
    delayedTasks: 3,

    changes: {
      totalTasks: 12,
      completedTasks: 20,
      inProgressTasks: -5,
      delayedTasks: 2,
    },
  },

  /* ========================================
     TASKS
  ======================================== */

  tasks: [
    {
      id: 1,

      title: "طراحی صفحه ورود",

      priority: {
        key: "high",
        label: "زیاد",
      },

      status: {
        key: "progress",
        label: "در حال انجام",
      },

      completed: false,

      /*
       * تاریخ اصلی برای منطق برنامه
       * فرمت: YYYY-MM-DD شمسی
       */
      dueDate: "1405-05-18",

      /*
       * فقط برای نمایش سریع در UI
       */
      dueLabel: "امروز",

      assignee: {
        id: 1,
        name: "زهرا اسدی",
        avatar: "./assets/images/Front-End Developer.svg",
      },

      projectId: 1,
    },

    {
      id: 2,

      title: "پیاده‌سازی صفحه ثبت‌نام",

      priority: {
        key: "medium",
        label: "متوسط",
      },

      status: {
        key: "completed",
        label: "انجام شده",
      },

      completed: true,

      dueDate: "1405-05-19",
      dueLabel: "فردا",

      assignee: {
        id: 1,
        name: "زهرا اسدی",
        avatar: "./assets/images/Front-End Developer.svg",
      },

      projectId: 1,
    },

    {
      id: 3,

      title: "طراحی داشبورد مدیریت",

      priority: {
        key: "low",
        label: "کم",
      },

      status: {
        key: "late",
        label: "دارای تأخیر",
      },

      completed: false,

      dueDate: "1405-05-20",
      dueLabel: "۲ روز دیگر",

      assignee: {
        id: 1,
        name: "زهرا اسدی",
        avatar: "./assets/images/Front-End Developer.svg",
      },

      projectId: 1,
    },

    {
      id: 4,

      title: "بررسی نسخه موبایل",

      priority: {
        key: "medium",
        label: "متوسط",
      },

      status: {
        key: "progress",
        label: "در حال انجام",
      },

      completed: false,

      dueDate: "1405-05-21",
      dueLabel: "۳ روز دیگر",

      assignee: {
        id: 1,
        name: "زهرا اسدی",
        avatar: "./assets/images/Front-End Developer.svg",
      },

      projectId: 1,
    },

    {
      id: 5,

      title: "تست نهایی داشبورد",

      priority: {
        key: "high",
        label: "زیاد",
      },

      status: {
        key: "progress",
        label: "در حال انجام",
      },

      completed: false,

      dueDate: "1405-05-23",
      dueLabel: "۵ روز دیگر",

      assignee: {
        id: 3,
        name: "مریم پارسا",
        avatar: "./assets/images/UI Designer.svg",
      },

      projectId: 1,
    },
  ],

  /* ========================================
     ACTIVITIES
  ======================================== */

  activities: [
    {
      id: 1,

      user: {
        id: 1,
        name: "زهرا اسدی",
        avatar: "./assets/images/Front-End Developer.svg",
        avatarAlt: "زهرا اسدی",
      },

      action: "وظیفه",
      target: "طراحی صفحه ورود",
      description: "را ایجاد کرد.",

      timestamp: "2026-08-08T15:30:00",
      timeLabel: "۵ دقیقه پیش",

      type: "task-created",
    },

    {
      id: 2,

      user: {
        id: 1,
        name: "زهرا اسدی",
        avatar: "./assets/images/Front-End Developer.svg",
        avatarAlt: "زهرا اسدی",
      },

      action: "وضعیت پروژه",
      target: "داشبورد مدیریت",
      description: "را تغییر داد.",

      timestamp: "2026-08-08T15:10:00",
      timeLabel: "۲۵ دقیقه پیش",

      type: "project-updated",
    },

    {
      id: 3,

      user: {
        id: 1,
        name: "زهرا اسدی",
        avatar: "./assets/images/Front-End Developer.svg",
        avatarAlt: "زهرا اسدی",
      },

      action: "فایل جدیدی در پروژه",
      target: "کارینو",
      description: "بارگذاری کرد.",

      timestamp: "2026-08-07T18:00:00",
      timeLabel: "دیروز",

      type: "file-uploaded",
    },
  ],

  /* ========================================
     MEETINGS
  ======================================== */

  meetings: [
    {
      id: 1,

      title: "جلسه طراحی داشبورد",

      /*
       * تاریخ شمسی
       */
      date: "1405-05-18",

      startTime: "10:00",
      endTime: "11:00",

      type: "online",
      typeLabel: "آنلاین",

      color: "purple",

      projectId: 1,

      participants: [
        {
          id: 1,
          name: "زهرا اسدی",
          role: "Front-End Developer",
          avatar: "./assets/images/Front-End Developer.svg",
        },

        {
          id: 3,
          name: "مریم پارسا",
          role: "UI Designer",
          avatar: "./assets/images/UI Designer.svg",
        },

        {
          id: 4,
          name: "محمد سعیدی",
          role: "Product Manager",
          avatar: "./assets/images/Product Manager.svg",
        },
      ],
    },

    {
      id: 2,

      title: "جلسه اسپرینت",

      date: "1405-05-19",

      startTime: "13:30",
      endTime: "14:30",

      type: "office",
      typeLabel: "حضوری",

      color: "orange",

      projectId: 1,

      participants: [
        {
          id: 2,
          name: "علی محمدی",
          role: "Back-End Developer",
          avatar: "./assets/images/Back-End Developer.svg",
        },

        {
          id: 3,
          name: "مریم پارسا",
          role: "UI Designer",
          avatar: "./assets/images/UI Designer.svg",
        },
      ],
    },

    {
      id: 3,

      title: "بررسی تجربه کاربری",

      date: "1405-05-21",

      startTime: "11:00",
      endTime: "12:00",

      type: "online",
      typeLabel: "آنلاین",

      color: "purple",

      projectId: 1,

      participants: [
        {
          id: 1,
          name: "زهرا اسدی",
          role: "Front-End Developer",
          avatar: "./assets/images/Front-End Developer.svg",
        },

        {
          id: 3,
          name: "مریم پارسا",
          role: "UI Designer",
          avatar: "./assets/images/UI Designer.svg",
        },
      ],
    },

    {
      id: 4,

      title: "جلسه بررسی پیشرفت پروژه",

      date: "1405-05-23",

      startTime: "09:30",
      endTime: "10:30",

      type: "office",
      typeLabel: "حضوری",

      color: "orange",

      projectId: 1,

      participants: [
        {
          id: 1,
          name: "زهرا اسدی",
          role: "Front-End Developer",
          avatar: "./assets/images/Front-End Developer.svg",
        },

        {
          id: 2,
          name: "علی محمدی",
          role: "Back-End Developer",
          avatar: "./assets/images/Back-End Developer.svg",
        },

        {
          id: 4,
          name: "محمد سعیدی",
          role: "Product Manager",
          avatar: "./assets/images/Product Manager.svg",
        },
      ],
    },
  ],

  /* ========================================
     PROJECTS
  ======================================== */

  // ========================================
  // PROJECTS
  // ========================================

  projects: [
    {
      id: 1,

      name: "کارینو",

      description: "مدیریت هوشمند پروژه‌های برنامه‌نویسی",

      status: {
        key: "active",
        label: "فعال",
      },

      progress: 70,

      deadline: "1405-04-12",

      team: [
        {
          name: "زهرا اسدی",
          avatar: "./assets/images/Front-End Developer.svg",
        },
        {
          name: "علی محمدی",
          avatar: "./assets/images/Back-End Developer.svg",
        },
        {
          name: "مریم پارسا",
          avatar: "./assets/images/UI Designer.svg",
        },
      ],
    },

    {
      id: 2,

      name: "داشبورد مدیریت",

      description: "طراحی و توسعه داشبورد مدیریت پروژه",

      status: {
        key: "active",
        label: "فعال",
      },

      progress: 45,

      deadline: "1405-04-20",

      team: [
        {
          name: "زهرا اسدی",
          avatar: "./assets/images/Front-End Developer.svg",
        },
        {
          name: "مریم پارسا",
          avatar: "./assets/images/UI Designer.svg",
        },
      ],
    },

    {
      id: 3,

      name: "اپلیکیشن فروش",

      description: "طراحی رابط کاربری اپلیکیشن فروش آنلاین",

      status: {
        key: "completed",
        label: "تکمیل شده",
      },

      progress: 100,

      deadline: "1405-03-30",

      team: [
        {
          name: "علی محمدی",
          avatar: "./assets/images/Back-End Developer.svg",
        },
      ],
    },
  ],
  /* ========================================
     TEAM
  ======================================== */

  team: [
    {
      id: 1,

      name: "زهرا اسدی",

      job: "Front-End Developer",

      status: {
        key: "online",
        label: "آنلاین",
      },

      avatar: "./assets/images/Front-End Developer.svg",
    },

    {
      id: 2,

      name: "علی محمدی",

      job: "Back-End Developer",

      status: {
        key: "offline",
        label: "آفلاین",
      },

      avatar: "./assets/images/Back-End Developer.svg",
    },

    {
      id: 3,

      name: "مریم پارسا",

      job: "UI Designer",

      status: {
        key: "busy",
        label: "مشغول",
      },

      avatar: "./assets/images/UI Designer.svg",
    },

    {
      id: 4,

      name: "محمد سعیدی",

      job: "Product Manager",

      status: {
        key: "online",
        label: "آنلاین",
      },

      avatar: "./assets/images/Product Manager.svg",
    },
  ],

 
};
